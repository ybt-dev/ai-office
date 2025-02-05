import { IAgentRuntime, Provider, State, Memory } from "@elizaos/core";

export const TABLE_TOPIC_KEY = "twitter/current_topic";

const DEFAULT_TOPIC = "crypto memes";

export class TwitterTopicProvider implements Provider {
    async get(runtime: IAgentRuntime, message: Memory, state?: State): Promise<string> {
        try {
            const content = typeof message.content === 'string'
                ? message.content
                : message.content?.text;

            if (!content) {
                throw new Error("No message content provided");
            }

            const topicFromDB = (await runtime.cacheManager.get<string>(TABLE_TOPIC_KEY)) || DEFAULT_TOPIC;

            return `Use this topic: ${topicFromDB} as a main topic for tweet generation`;
        } catch (error) {
            console.error("TwitterTopicProvider error:", error);
            return `Error: ${error.message}`;
        }
    }
}