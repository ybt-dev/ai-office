import {composeContext, elizaLogger, generateText, IAgentRuntime, Memory, ModelClass} from "@elizaos/core";
import {agentsManager} from "../agents/manager/index.ts";
import {initializeDatabase} from "../index.ts";

const NOT_FOUND = "Request not found";

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
        template: template
    });
}

const extractAdditional = (messageState: string) => {
    const regex= /Additional Question: (true|false)/;
    const match = messageState.match(regex);
    return match ? match[1] : NOT_FOUND;
}

const extractRequestForInfluencer = (messageState: string) => {
    const regex = /COMMUNICATE_WITH_AGENTS\s+influencer-id\s+"([\s\S]*?)"/m;
    const match = messageState.match(regex);
    elizaLogger.log("match", match)
    return match ? match[1] : NOT_FOUND;
};

const extractRequestForProducer = (messageState: string) => {
    const regex = /COMMUNICATE_WITH_AGENTS\s+producer-id\s+"(.*?)"/;
    const match = messageState.match(regex);
    return match ? match[1] : NOT_FOUND;
}

const getListOfInteraction = async () => {
    const { client } = initializeDatabase();
    const database = client.db("ai-office");

    return (await database.collection("agent_team_interactions").find().toArray());
}

export const loopDBHandler = async () => {
    elizaLogger.log("Starting loopDBHandler");

    setInterval(async () => {
        elizaLogger.log("Checking for database changes...");

        const list = await getListOfInteraction();
        if (list.length > 0) {
            for(const item of list) {
                await conversationHandler(item._id.toString(), item.organization.toString(), item.requestContent);
            }
        }

    }, 30000);
};


export const conversationHandler = async (interactionId: string, organisationId: string, requestContent: string) => {
    try {
    elizaLogger.log("Start Conversation");


    const all = agentsManager.getAllAgents();
    // console.log("all agents from manager", all); - тут работает
    const res = agentsManager.getAgentByRole(organisationId, 'producer');

    elizaLogger.log("All agents", all); // - тут не работает
    elizaLogger.log("agentsManager.getAgentByRole(organisationId, producer)", res);

    const producerRuntime =  agentsManager.getAgentByRole(organisationId, "producer");

    elizaLogger.log("producerRuntime", producerRuntime);

    const influencerRuntime =  agentsManager.getAgentByRole(organisationId, "influencer");

    elizaLogger.log("influencerRuntime", influencerRuntime);

    let isFinishConversation = false;
    let userPrompt = requestContent

    // while(!isFinishConversation) {
    //     const producerContext = await createContextForLLM(userPrompt, influencerRuntime.agentId, producerRuntime, mainProducerResponseTemplate);
    //
    //     const respondFromProducer = await generateText({
    //         runtime: producerRuntime,
    //         context: producerContext,
    //         modelClass: ModelClass.LARGE
    //     });
    //     elizaLogger.log("RespondFromProducer", respondFromProducer)
    //     const extractedRequest = extractRequestForInfluencer(respondFromProducer);
    //     elizaLogger.log("ExtractedRequest", extractedRequest)
    //     if(extractedRequest !== NOT_FOUND) {
    //
    //         const inflContext = await createContextForLLM(extractedRequest, producerRuntime.agentId, influencerRuntime, influencerResponseTemplate);
    //
    //         const respondFromInfluencer = await generateText({
    //             runtime: influencerRuntime,
    //             context: inflContext,
    //             modelClass: ModelClass.LARGE
    //         });
    //
    //         elizaLogger.log("RepondFromInfluencer", respondFromInfluencer)
    //
    //         const additional = extractAdditional(respondFromInfluencer);
    //         elizaLogger.log("Additional Info from response", additional)
    //
    //         if(additional !== NOT_FOUND && additional === "true") {
    //             userPrompt = respondFromInfluencer;
    //             continue
    //         } else {
    //             isFinishConversation = true;
    //         }
    //     } else {
    //         isFinishConversation = true;
    //     }
    // }

    elizaLogger.log("IsConverestionIsFinished", isFinishConversation)
    return null;
    } catch (e) {
        elizaLogger.error("ERROR", e)
    }
}
