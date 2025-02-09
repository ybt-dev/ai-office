import {MongoClient} from "mongodb";
import {MongoDBDatabaseAdapter} from "@elizaos/adapter-mongodb";
import {DirectClient} from "@elizaos/client-direct";
import {AutoClientInterface} from "@elizaos/client-auto";
import {
  AgentRuntime,
  CacheManager,
  Character,
  DbCacheAdapter,
  elizaLogger,
  IAgentRuntime,
  ICacheManager,
  IDatabaseAdapter,
  IDatabaseCacheAdapter,
  ModelProviderName,
  settings,
  stringToUuid,
} from "@elizaos/core";
import {createNodePlugin} from "@elizaos/plugin-node";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {TwitterTopicProvider} from "./providers/twitterTopicProvider/index.ts";
import {agentsManager} from "./agents/manager/index.ts";
import {configDotenv} from "dotenv";
import {TelegramClientInterface} from "@elizaos/client-telegram";
import {communicateWithAgents} from "./actions/communicate-agent/index.ts";
import {loopDBHandler} from "./utils/dialogue-system.ts";
import {generateCharacter} from "./utils/character-generator.ts";

configDotenv();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

export function getTokenForProvider(
  provider: ModelProviderName,
  character: Character
) {
  switch (provider) {
    case ModelProviderName.OPENAI:
      return (
        character.settings?.secrets?.OPENAI_API_KEY || settings.OPENAI_API_KEY
      );
    case ModelProviderName.LLAMACLOUD:
      return (
        character.settings?.secrets?.LLAMACLOUD_API_KEY ||
        settings.LLAMACLOUD_API_KEY ||
        character.settings?.secrets?.TOGETHER_API_KEY ||
        settings.TOGETHER_API_KEY ||
        character.settings?.secrets?.XAI_API_KEY ||
        settings.XAI_API_KEY ||
        character.settings?.secrets?.OPENAI_API_KEY ||
        settings.OPENAI_API_KEY
      );
    case ModelProviderName.ANTHROPIC:
      return (
        character.settings?.secrets?.ANTHROPIC_API_KEY ||
        character.settings?.secrets?.CLAUDE_API_KEY ||
        settings.ANTHROPIC_API_KEY ||
        settings.CLAUDE_API_KEY
      );
    case ModelProviderName.REDPILL:
      return (
        character.settings?.secrets?.REDPILL_API_KEY || settings.REDPILL_API_KEY
      );
    case ModelProviderName.OPENROUTER:
      return (
        character.settings?.secrets?.OPENROUTER || settings.OPENROUTER_API_KEY
      );
    case ModelProviderName.GROK:
      return character.settings?.secrets?.GROK_API_KEY || settings.GROK_API_KEY;
    case ModelProviderName.HEURIST:
      return (
        character.settings?.secrets?.HEURIST_API_KEY || settings.HEURIST_API_KEY
      );
    case ModelProviderName.GROQ:
      return character.settings?.secrets?.GROQ_API_KEY || settings.GROQ_API_KEY;
  }
}

export function initializeDatabase() {
  const DATABASE_URL = process.env.MONGODB_URL || "";
  const DATABASE_NAME = process.env.MONGODB_NAME || "ai-office";

  const client = new MongoClient(DATABASE_URL);
  const db = new MongoDBDatabaseAdapter(client, DATABASE_NAME);

  return {
    db,
    client
  };
}

export async function initializeClients(
  character: Character,
  runtime: IAgentRuntime
) {
  const clients = [];
  const clientTypes = character.clients?.map((str) => str.toLowerCase()) || [];

  if (clientTypes.includes("auto")) {
    const autoClient = await AutoClientInterface.start(runtime);
    if (autoClient) clients.push(autoClient);
  }

  if (clientTypes.includes("telegram")) {
    const telegramClient = await TelegramClientInterface.start(runtime);
    if (telegramClient) clients.push(telegramClient);
  }

  // if (clientTypes.includes("twitter")) {
  //   const twitterClients = await TwitterClientInterface.start(runtime)
  //   clients.push(twitterClients);
  // }

  if (character.plugins?.length > 0) {
    for (const plugin of character.plugins) {
      if (plugin.clients) {
        for (const client of plugin.clients) {
          clients.push(await client.start(runtime));
        }
      }
    }
  }

  return clients;
}

let nodePlugin: any | undefined;

export function createAgent(
  character: Character,
  db: IDatabaseAdapter,
  cache: ICacheManager,
  token: string
) {
  elizaLogger.success(
    elizaLogger.successesTitle,
    "Creating runtime for character",
    character.name
  );

  nodePlugin ??= createNodePlugin();

  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [nodePlugin],
    providers: [new TwitterTopicProvider()],
    actions: [communicateWithAgents],
    services: [],
    managers: [],
    cacheManager: cache,
  });
}

function intializeDbCache(character: Character, db: IDatabaseCacheAdapter) {
  const cache = new CacheManager(new DbCacheAdapter(db, character.id));
  return cache;
}

async function startAgent(character: Character, organizationId: string, role: string, directClient: DirectClient) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;

    const token = getTokenForProvider(character.modelProvider, character);
    const dataDir = path.join(__dirname, "../data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const { db } = initializeDatabase();

    await db.init();

    const cache = intializeDbCache(character, db);
    const runtime = createAgent(character, db, cache, token);

    await runtime.initialize();

    const cookies = runtime.getSetting('TWITTER_COOKIES') || process.env.TWITTER_COOKIES;
    const username = runtime.getSetting('TWITTER_USERNAME') || process.env.TWITTER_USERNAME;

    if (cookies) {
      elizaLogger.log(`Reading cookies from ENV...`);

      await runtime.cacheManager.set(
        `twitter/${username}/cookies`,
        JSON.parse(cookies),
      );
    }

    const clients = await initializeClients(character, runtime);

    directClient.registerAgent(runtime);

    agentsManager.addAgent(runtime.agentId, runtime, organizationId, role);
    return clients;
  } catch (error) {
    elizaLogger.error(
      `Error starting agent for character ${character.name}:`,
      error
    );
    console.error(error);
    throw error;
  }
}

async function addAgentHandler() {
  try {
    const agents: {
      character: Character,
      organizationId: string,
      role: string,
    }[] = [];
    const { client, db } = initializeDatabase();
    const database = client.db("ai-office");

    if (!database) {
      throw new Error("No db exist");
    }
    const dbAgentsList = await database.collection("agents").find().toArray();
    for (const item of dbAgentsList) {
      if (!agentsManager.findAgents(item["_id"].toString())) {
        const newAgent = generateCharacter(item["_id"].toString(), item.name, item.role);

        elizaLogger.log("id", item.organization.toString()+item.role);
        agents.push({
          character: newAgent,
          organizationId: item.organization.toString(),
          role: item.role,
        })
      }
    }

    return agents;
  } catch (e) {
    console.log(e);
  }
}

async function deleteAgentHandler() {
  try {
    const agents: AgentRuntime[] = agentsManager.getAllAgents();

    const { client } = initializeDatabase();
    const database =  client.db("ai-office");

    if (!database) {
      throw new Error("No db exist");
    }

    const dbAgentsList = await database.collection("agents").find().toArray();
    for (const item of agents) {
      const itemFromDB = dbAgentsList.find(el => el["_id"].toString() !== item.agentId)
      if (!itemFromDB) {
        await item.stop();
        agentsManager.removeAgent(item.agentId);
      }
    }

    return agents;
  } catch (e) {
    console.log("Error", e)
  }
}

// const processAgentsFromDatabase = async (
//     database: any
// ) => {
//   const databaseAgents = await database.collection('agents').find({}).toArray();
//
//   const databaseAgentIdsSet: Set<string> = new Set();
//
//   for (const databaseAgent of databaseAgents) {
//     const databaseAgentId = databaseAgent._id.toString();
//
//     databaseAgentIdsSet.add(databaseAgentId);
//
//     // TODO Handle agent settings change
//     if (agentsManager.hasAgent(databaseAgentId)) {
//       continue;
//     }
//
//     const newAgent = generateCharacter(databaseAgent._id.toString(), databaseAgent.name, databaseAgent.role);
//
//     agentsManager.addAgent(
//       databaseAgentId,
//         await createAgent(newAgent),
//     );
//   }
//
//   for (const agent of agentsManager.getAllAgents()) {
//     if (!databaseAgentIdsSet.has(agent.agentId)) {
//       // kill agent
//       await agent.stop();
//       agentsManager.removeAgent(agent.agentId);
//     } else {
//       agent.initialize()()
//     }
//   }
// };

const loopAgentHandler = async (directClient: DirectClient) => {
  elizaLogger.log("Starting loopAgentHandler");

  setInterval(async () => {
    elizaLogger.log("Checking for database changes...");
    const listOfNewAgents = await addAgentHandler();

    for (const { character, organizationId, role} of listOfNewAgents) {
      await startAgent(character, organizationId, role, directClient as DirectClient);
    }
  }, 30000);

  setInterval(async () => {
    elizaLogger.log("Checking if agents exist in database...");
    await deleteAgentHandler();
  }, 120000);
};

// const createCustomAgent = async (character: Character) => {
//   const { db } = initializeDatabase();
//
//   const token = getTokenForProvider(character.modelProvider, character);
//   const cache = intializeDbCache(character, db);
//
//   return createAgent(character, db, cache, token);
// }

const startAgents = async () => {
  const directClient = new DirectClient();

  try {
    await loopAgentHandler(directClient);

    await loopDBHandler();
  } catch (error) {
    elizaLogger.error("Error starting agents:", error);
  }
};

startAgents().catch((error) => {
  elizaLogger.error("Unhandled error in startAgents:", error);

  if (error instanceof Error) {
    console.error(error.stack);
  }
});
