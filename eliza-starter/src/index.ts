import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { MongoClient } from "mongodb";
import { MongoDBDatabaseAdapter } from "@elizaos/adapter-mongodb";
import { DirectClient } from "@elizaos/client-direct";
import { AutoClientInterface } from "@elizaos/client-auto";
import {
  DbCacheAdapter,
  defaultCharacter,
  FsCacheAdapter,
  ICacheManager,
  IDatabaseCacheAdapter,
  stringToUuid,
  AgentRuntime,
  CacheManager,
  Character,
  IAgentRuntime,
  ModelProviderName,
  elizaLogger,
  settings,
  IDatabaseAdapter,
  validateCharacterConfig,
  Client,
} from "@elizaos/core";
import { createNodePlugin } from "@elizaos/plugin-node";
import Database from "better-sqlite3";
import fs from "fs";
import yargs from "yargs";
import path from "path";
import { fileURLToPath } from "url";
import { producer } from "./characters/producer.ts";
import { advertiser } from "./characters/advertiser.ts";
import { influencer } from "./characters/influencer.ts";
import { TwitterTopicProvider } from "./providers/twitterTopicProvider/index.ts";
import { agentsManager } from "./agents/manager/index.ts";
import { configDotenv } from "dotenv";
import { TelegramClientInterface } from "@elizaos/client-telegram";
import { communicateWithAgents } from "./actions/communicate-agent/index.ts";
import { callGenerate } from "./utils/dialogue-system.ts";

configDotenv();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

class ExtendedDirectClient extends DirectClient {
  constructor() {
    super();
    this.app.post("/newRoute", async (req: any, res: any) => {
      await callGenerate();
      res.json({ message: "New route added successfully" });
    });
  }
}
const DirectClientInterface: Client = {
  start: async (_runtime: IAgentRuntime) => {
    elizaLogger.log("DirectClientInterface start");
    const client = new ExtendedDirectClient();
    const serverPort = parseInt(settings.SERVER_PORT || "3000");
    client.start(serverPort);
    return client;
  },
  stop: async (_runtime: IAgentRuntime, client?: Client) => {
    if (client instanceof ExtendedDirectClient) {
      client.stop();
    }
  },
};

export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

export function parseArguments(): {
  character?: string;
  characters?: string;
} {
  try {
    return yargs(process.argv.slice(2))
      .option("character", {
        type: "string",
        description: "Path to the character JSON file",
      })
      .option("characters", {
        type: "string",
        description: "Comma separated list of paths to character JSON files",
      })
      .parseSync();
  } catch (error) {
    console.error("Error parsing arguments:", error);
    return {};
  }
}

export async function loadCharacters(
  charactersArg: string
): Promise<Character[]> {
  let characterPaths = charactersArg?.split(",").map((filePath) => {
    if (path.basename(filePath) === filePath) {
      filePath = "../characters/" + filePath;
    }
    return path.resolve(process.cwd(), filePath.trim());
  });

  const loadedCharacters = [];

  if (characterPaths?.length > 0) {
    for (const path of characterPaths) {
      try {
        const character = JSON.parse(fs.readFileSync(path, "utf8"));

        validateCharacterConfig(character);

        loadedCharacters.push(character);
      } catch (e) {
        console.error(`Error loading character from ${path}: ${e}`);
        // don't continue to load if a specified file is not found
        process.exit(1);
      }
    }
  }

  if (loadedCharacters.length === 0) {
    console.log("No characters found, using default character");
    loadedCharacters.push(defaultCharacter);
  }

  return loadedCharacters;
}

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

function initializeDatabase(dataDir: string) {
  // const DATABASE_URL = "";
  // CONST DATABASE_NAME = ""
  // const client = new MongoClient(DATABASE_URL)
  // const db = new MongoDBDatabaseAdapter(client, DATABASE_NAME);
  // return db;

  if (process.env.POSTGRES_URL) {
    const db = new PostgresDatabaseAdapter({
      connectionString: process.env.POSTGRES_URL,
    });
    return db;
  } else {
    const filePath =
      process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
    // ":memory:";
    const db = new SqliteDatabaseAdapter(new Database(filePath));
    return db;
  }
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

  if (clientTypes.includes("direct")) {
    const directClient = await DirectClientInterface.start(runtime);
    if (directClient) clients.push(directClient);
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

function intializeFsCache(baseDir: string, character: Character) {
  const cacheDir = path.resolve(baseDir, character.id, "cache");

  const cache = new CacheManager(new FsCacheAdapter(cacheDir));
  return cache;
}

function intializeDbCache(character: Character, db: IDatabaseCacheAdapter) {
  const cache = new CacheManager(new DbCacheAdapter(db, character.id));
  return cache;
}

async function startAgent(character: Character, directClient: DirectClient) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;

    const token = getTokenForProvider(character.modelProvider, character);
    const dataDir = path.join(__dirname, "../data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = initializeDatabase(dataDir);

    await db.init();

    const cache = intializeDbCache(character, db);
    const runtime = createAgent(character, db, cache, token);

    await runtime.initialize();

    const cookies =
      runtime.getSetting("TWITTER_COOKIES") || process.env.TWITTER_COOKIES;
    const username =
      runtime.getSetting("TWITTER_USERNAME") || process.env.TWITTER_USERNAME;

    if (cookies) {
      elizaLogger.log(`Reading cookies from ENV...`);

      await runtime.cacheManager.set(
        `twitter/${username}/cookies`,
        JSON.parse(cookies)
      );
    }

    const clients = await initializeClients(character, runtime);

    directClient.registerAgent(runtime);

    agentsManager.addAgent(runtime.agentId, runtime);

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

const startAgents = async () => {
  const directClient = new DirectClient();
  const args = parseArguments();

  let charactersArg = args.characters || args.character;

  // let characters = [producer, advertiser, influencer];
  let characters = [influencer, producer];
  console.log("charactersArg", charactersArg);
  if (charactersArg) {
    characters = await loadCharacters(charactersArg);
  }
  console.log("characters", characters);
  try {
    for (const character of characters) {
      await startAgent(character, directClient as DirectClient);
    }

    await callGenerate();
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
