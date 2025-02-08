import { composeContext, elizaLogger, generateText, ModelClass, Memory, IAgentRuntime } from "@elizaos/core";
import { agentsManager } from "../agents/manager/index.ts";
import { PRODUCER_AGENT_ID } from "../characters/producer.ts";
import { INFLUENCER_AGENT_ID } from "../characters/influencer.ts";

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

User prompt: "Hey, Lex. We have an idea, to write some posts on twitter about Liverpool and we need audience. Also need some advertisement strategy Can you help us with that?".

Your task:
1. Read the user prompt.
2. Determine the most appropriate agent to handle this request. 
3. Output your response exactly in the following format:
   COMMUNICATE_WITH_AGENTS <agentId> <request details>
   where:
     - <agentId> is the identifier of the chosen agent.
     - <request details> is your request to an agent.
4. If you need to call few agents, do that in the column.
5. Then, on a new line, provide a final answer for the user explaining what action has been taken.


For example, your response may look like:

COMMUNICATE_WITH_AGENTS agentId "Hey Agent, I have a request from user for project advertisement. I prepared strategy for you..."

Final answer: I have forwarded your request to our advertiser agent, who will assist you with advertising your coin shortly.
`;

const influencerResponseTemplate = `
# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You are a part of  team with the following agents:
-> producer: "producer-id"

# The text above is system information about you.

User Prompt: Use this markething strategy for your twitter post.

Your task:
1. Read the user prompt.
2. Output your response exactly in the following format:
   COMMUNICATE_WITH_AGENTS <agentId> <request details>
   where:
     - <agentId> is the identifier of the chosen agent.
     - <request details> is your request to an agent.
3. If you need to call few agents to provide more info, do that in the column.
4. If you response don't need additional info, add "Additional Question: false" in the column
5. Then, on a new line, provide a final answer for the user explaining what action has been taken.

For example, your response may look like:
COMMUNICATE_WITH_AGENTS agentId "Hey Agent, I need some more information from your strategy..."

Additional Question: yes
Final answer: Yes, I can do it, but wait for additional information.
`;

const advertiserResponseTemplate = `
# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You are a part of  team with the following agents:
-> producer: "producer-id"
-> influencer: "influencer-id"

# The text above is system information about you.

Your task:
1. Read the user prompt.
3. Output your response exactly in the following format:
   COMMUNICATE_WITH_AGENTS <agentId> <request details>
   where:
     - <agentId> is the identifier of the chosen agent.
     - <request details> is your request to an agent.
4. If you need to call few agents to provide more info, do that in the column.
5. Then, on a new line, provide a final answer for the user explaining what action has been taken.

For example, your response may look like:
COMMUNICATE_WITH_AGENTS agentId "Hey Agent, I need some more information about strategy..."

Final answer: Yes, I can do it, but wait for additional information.
Additional Answer: yes
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

    const choosenTemplate = {
        PRODUCER_AGENT_ID: mainProducerResponseTemplate,
        INFLUENCER_AGENT_ID: influencerResponseTemplate
    }

    const context = await composeContext({
        state,
        template: template
    });

    return context;
}


const exampleResponse =`
  COMMUNICATE_WITH_AGENTS producer-id "User requested to use a specific marketing strategy for a Twitter post. Could you please provide the details of the marketing strategy to proceed?"
  
  Additional Question: false
  Final answer: I've reached out to the producer for the marketing strategy details needed for your Twitter post
  `;
const extractAdditional = (messageState: string) => {
    const regex= /Additional Question: (true|false)/;
    const match = messageState.match(regex);
    return match ? match[1] : NOT_FOUND;
}

const extractRequestForInfluencer = (messageState: string) => {
    const regex = /COMMUNICATE_WITH_AGENTS\s+influencer-id\s+"(.*?)"/;
    const match = messageState.match(regex);
    return match ? match[1] : NOT_FOUND;
};

const extractRequestForProducer = (messageState: string) => {
    const regex = /COMMUNICATE_WITH_AGENTS\s+producer-id\s+"(.*?)"/;
    const match = messageState.match(regex);
    return match ? match[1] : NOT_FOUND;
}

export const callGenerate = async () => {
    try {
    elizaLogger.log("Start conversation func")
    const producerRuntime = await agentsManager.getAgent(PRODUCER_AGENT_ID);
    const influencerRuntime = await agentsManager.getAgent(INFLUENCER_AGENT_ID);

    let isFinishConversation = false;
    let userPrompt = "Hey, Lex. We have an idea, to write some posts on twitter about Liverpool and we need audience. Also need some advertisement strategy Can you help us with that?";

    while(!isFinishConversation) {
        const producerContext = await createContextForLLM(userPrompt, influencerRuntime.agentId, producerRuntime, mainProducerResponseTemplate);

        const respondFromProducer = await generateText({
            runtime: producerRuntime,
            context: producerContext,
            modelClass: ModelClass.LARGE
        });
        elizaLogger.log("RespondFromProducer", respondFromProducer)
        const extractedRequest = extractRequestForInfluencer(respondFromProducer);
        elizaLogger.log("ExtractedRequest", extractedRequest)
        if(extractedRequest !== NOT_FOUND) {
            const inflContext = await createContextForLLM(extractedRequest, producerRuntime.agentId, influencerRuntime, influencerResponseTemplate);
            
            const respondFromInfluencer = await generateText({
                runtime: influencerRuntime,
                context: inflContext,
                modelClass: ModelClass.LARGE
            });

            elizaLogger.log("RepondFromInfluencer", respondFromInfluencer)

            const additional = extractAdditional(respondFromInfluencer);
            elizaLogger.log("Additional Info from response", additional)

            if(additional !== NOT_FOUND && additional === "true") {
                userPrompt = respondFromInfluencer;
                continue
            } else {
                isFinishConversation = true;
            }
        } else {
            isFinishConversation = true;
        }
    }

    elizaLogger.log("IsConverestionIsFinished", isFinishConversation)
    return null;
    } catch (e) {
        elizaLogger.error("ERROR", e)
    }
}

/**
 * Задачи на завтра:
 * -> обновить общение между ИИ
 * -> сохранять общение в БД
 */
