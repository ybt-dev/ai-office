import { composeContext, elizaLogger, generateMessageResponse, generateText, ModelClass, Memory } from "@elizaos/core";
import { agentsManager } from "../agents/manager/index.ts";
import { PRODUCER_AGENT_ID } from "../characters/producer.ts";
import { ADVERTISER_AGENT_ID } from "../characters/advertiser.ts";
import { INFLUENCER_AGENT_ID } from "../characters/influencer.ts";

const mainProducerResponseTemplate = `
# About you - {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{actions}}

You have a team with the following agents:
-> influencer: "sdasd-sadasd-sdsd-sd-sfsf-sdas"
-> advertiser: "popopo-0[pppo]-popop-popo0-po"
-> blockchain developer: "vnnvnv-bvbvbvb-bvvbvb-vbvbvb"

# The text above is system information about you.

User prompt: "Hey, Lex. We have an idea, to write some posts on twitter about Liverpool and we need audience. Also we need to developer a smart contract. Can you help us with that?".

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

export const callGenerate = async () => {
    const producerRuntime = await agentsManager.getAgent(PRODUCER_AGENT_ID);
    const advertiserRuntime = await agentsManager.getAgent(ADVERTISER_AGENT_ID);
    const influencerRuntime = await agentsManager.getAgent(INFLUENCER_AGENT_ID);

    const message: Memory = {
        userId: advertiserRuntime.agentId,
        agentId: producerRuntime.agentId,
        roomId: producerRuntime.agentId,
        content: {
            text: "How are you?"
        }
    }
    const state = await producerRuntime.composeState(message);

    const newContext = await composeContext({
        state,
        template: mainProducerResponseTemplate
    })

    elizaLogger.log("newContext", newContext)

    // elizaLogger.log("LOG", newContext)
    const res = await generateText({
        runtime: producerRuntime,
        context: newContext,
        modelClass: ModelClass.LARGE
    });
    // const res = await generateMessageResponse({
    //     runtime: producerAgent,
    //     context: `How are you? + ${shouldMessageResponseTemplate}`,
    //     modelClass: ModelClass.LARGE
    // });

    // await producerRuntime.processActions(message, [message]);

    elizaLogger.log("Result from GenerateMessageResponse", res);
    return null;
}

/**
 * Задачи на завтра:
 * -> обновить общение между ИИ
 * -> сохранять общение в БД
 * -> Написать псевдо код для общения
 * 
 * 
 * ИИ один по промту даёт ответ и обращается к агента А и агенту Б. Агент А или Агент Б генерирурет ответ и в нужде обращается к босу и получает ответ. 
 * 
 * До тех пор пока не будет всё согласовано
 */
