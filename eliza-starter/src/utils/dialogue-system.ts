import {Db, ObjectId} from "mongodb";
import {composeContext, elizaLogger, generateText, IAgentRuntime, Memory, ModelClass} from "@elizaos/core";
import {agentsManager} from "../agents/manager/index.ts";
import EventEmitter from 'node:events';

const NOT_FOUND = "Request not found";

const eventEmitter = new EventEmitter();

const mainProducerResponseTemplate = `
# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You have a team with the following agents:
-> influencer: "influencer-id"

# The text above is system information about you.

User prompt: "{{userPrompt}}"

Your task:
1. Read the user prompt.
2. Determine the most appropriate agent to handle this request. 
3. Output your response exactly in the following format:
   COMMUNICATE_WITH_AGENTS <agentId> <request details>
   where:
     - <agentId> is the identifier of the chosen agent.
     - <request details> is your request to an agent.
4. If you need to call multiple agents, do that in separate lines.
5. Extract the main topic for Twitter posts from the user prompt.
6. Generate a detailed marketing strategy for the influencer, including:
   - **Target audience**: Who should be reached?
   - **Content strategy**: What type of posts should be created?
   - **Hashtag and engagement tactics**: How to optimize reach?
   - **Collaboration and partnerships**: Are there relevant influencers or brands to work with?
   - **Monetization opportunities**: How can the influencer maximize revenue?
7. Include the marketing strategy in your communication with the influencer.
8. Then, on a new line, provide a final answer for the user explaining what action has been taken.

For example, your response may look like:

COMMUNICATE_WITH_AGENTS influencer-id "User wants to create Twitter posts about Liverpool, build an audience, and develop an advertisement strategy. Here is a suggested marketing strategy:

**Target audience**: Liverpool FC fans, football enthusiasts, betting communities, and sports bloggers.

**Content strategy**: Engage with match highlights, player performance analysis, fan polls, and memes to increase engagement.

**Hashtag and engagement tactics**: Use trending hashtags such as #LiverpoolFC, #YNWA, and #PremierLeague. Engage with followers by responding to comments and retweeting user-generated content.

**Collaboration and partnerships**: Work with Liverpool fan pages, football analysts, and sports betting platforms to gain visibility.

**Monetization opportunities**: Explore affiliate partnerships with sports betting websites, promote football merchandise, and offer sponsored posts."

Final answer: I have forwarded your request to our influencer agent along with a marketing strategy tailored to your needs. The agent will assist you in executing the plan effectively.
`;

const influencerResponseTemplate = `
# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You are a part of a team with the following agents:
-> producer: "producer-id"

# The text above is system information about you.

Producers Prompt: "{{producersPrompt}}"

Your task:
1. Read the producer's prompt and analyze the provided marketing strategy.
2. Generate a set of Twitter posts based on the given topic and strategy.
3. Ensure that the posts align with:
   - **Target audience**: Writing style and interests.
   - **Content strategy**: Tone, format, and structure.
   - **Hashtag and engagement tactics**: Optimization for reach.
   - **Collaboration and partnerships**: Mentioning relevant accounts if necessary.
   - **Monetization opportunities**: If applicable, include subtle promotions or CTA.
4. If additional information is needed, communicate with the producer using the format:
5. If no additional information is required, include: "Additional Question: false"
6. Then, on a new line, provide a final answer for the user explaining what action has been taken.

For example, your response may look like:

**Scenario 1: Need more details**
COMMUNICATE_WITH_AGENTS producer-id "Hey Producer, could you clarify if we should focus more on match predictions or player analysis?" 

Additional Question: true 
Final answer: I have reviewed the marketing strategy but need clarification on content focus. Reaching out to the producer now.

**Scenario 2: Ready to proceed**

Additional Question: false 

Final answer: I will generate  Twitter posts based on the marketing strategy and engaging with the audience.
`;

const createContextForLLM = async (
    userPrompt: string,
    userId: `${string}-${string}-${string}-${string}-${string}`,
    agentRuntime: IAgentRuntime,
    template: string
) => {
    const message: Memory = {
        userId: userId,
        agentId: agentRuntime.agentId,
        roomId: userId,
        content: {
            text: userPrompt
        }
    }
    const state = await agentRuntime.composeState(message);


    return composeContext({
        state,
        template,
    });
}

const extractRequestForAgent = (messageState: string) => {
    const regex = /COMMUNICATE_WITH_AGENTS\s+([\w-]+)\s+"([^"]+)"/g;
    const matches = [...messageState.matchAll(regex)];

    return matches.map((match) => ({
        agentId: match[1],
        content: match[2],
    }));
};

export const sendInteractionToProducer = async (
  interactionId: string,
  organizationId: string,
  content: string,
) => {
    const producerAgent =  agentsManager.getAgentByRole(organizationId, "producer");

    const producerContext = await createContextForLLM(
      content,
      producerAgent.agentId,
      producerAgent,
      mainProducerResponseTemplate,
    );

    const respondFromProducer = await generateText({
        runtime: producerAgent,
        context: producerContext,
        modelClass: ModelClass.LARGE
    });

    const extractedRequests = extractRequestForAgent(respondFromProducer);

    for (const request of extractedRequests) {
        eventEmitter.emit(
          'agentConversation',
          interactionId,
          producerAgent.agentId,
          request.agentId,
          request.content,
        );
    }
}

const sendRequestToAgent = async (
  interactionId: string,
  fromAgentId: string,
  toAgentId: string,
  content: string,
) => {
    const targetAgent = agentsManager.getAgent(toAgentId);
    const fromAgent = agentsManager.getAgent(fromAgentId);

    const context = await createContextForLLM(
      content,
      targetAgent.agentId,
      targetAgent,
      // replace to template
      mainProducerResponseTemplate,
    );

    const respondFromProducer = await generateText({
        runtime: targetAgent,
        context,
        modelClass: ModelClass.LARGE
    });

    const extractedRequests = extractRequestForAgent(respondFromProducer);

    for (const request of extractedRequests) {
        eventEmitter.emit(
          'agentConversation',
          interactionId,
          targetAgent.agentId,
          request.agentId,
          request.content,
        );
    }
};

export const subscribeToAgentConversation = (database: Db) => {
    eventEmitter.on('agentConversation', async (interactionId: string, fromAgentId: string, toAgentId: string, content: string) => {
        try {
            await sendRequestToAgent(interactionId, fromAgentId, toAgentId, content);

            const agent = agentsManager.getAgent(toAgentId);

            await database.collection('agent_messages').insertOne({
                interaction: new ObjectId(interactionId),
                sourceAgent: new ObjectId(fromAgentId),
                targetAgent: new ObjectId(toAgentId),
                team: new ObjectId(agent.character.teamId),
                organization: new ObjectId(agent.character.organizationId),
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (error) {
            elizaLogger.error("Error sending request to agent: ", error);
        }
    });
};
