import { Action, IAgentRuntime, Memory, State, HandlerCallback, ActionExample, Validator, generateMessageResponse, ModelClass, elizaLogger } from "@elizaos/core";
import { agentsManager } from "../../agents/manager/index.ts";
import { PRODUCER_AGENT_ID } from "../../characters/producer.ts";
import { unknown } from "zod";

export class ProcessNewStrategy implements Action {
    name = "PROCESS_STRATEGY";
    similes = ["STRATEGY"];
    description = "Proccess action throw all agents";
    suppressInitialMessage = true;
    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            // const provider = runtime.providers.find(p => p instanceof LatestTokenProfilesProvider);
            // if (!provider) {
            //     throw new Error("Token profiles provider not found");
            // }
            // const profilesData = await provider.get(runtime, message, state);
            

            const producerRuntime = agentsManager.getAgent(PRODUCER_AGENT_ID);

            const messagePrompt = `Use this twitter post: ${message.content.text}, create a main theme for this advertisement`;
            const res = await generateMessageResponse({
                runtime: producerRuntime,
                context: messagePrompt,
                modelClass: ModelClass.LARGE,
            })
            
            elizaLogger.log("Response from Producer Runtime AGENT", res.text);
            
            if (callback) {
                await callback({
                    text: res.text,
                    action: this.name
                });
            }

            if (state) {
                state.responseData = {
                    text: "some text",
                    action: this.name
                };
            }

            return true;
        } catch (error) {
            console.error("Error in token profiles action handler:", error);

            if (callback) {
                await callback({
                    text: `Sorry, I couldn't fetch the token profiles: ${error.message}`,
                    action: this.name
                });
            }

            return false;
        }
    }
    examples = [[
        {
            user: "user",
            content: {
                text: "Give me advertisement for crypto meme $PEPE",
                action: "PROCESS_STRATEGY",
            }
        },
        {
            user: "Agent",
            content: {
                text: "Yes, sure. Wait for new post from out influencer: crypto meme $PEPE"
            }
        }
    ]] as ActionExample[][];
    validate = async () => {
        return true;
    };
}

export const processNewStrategy = new ProcessNewStrategy();
