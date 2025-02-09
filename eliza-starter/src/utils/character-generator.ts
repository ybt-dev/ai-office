import { Character } from "@elizaos/core";
import { advertiser } from "../characters/advertiser.ts";
import { influencer } from "../characters/influencer.ts";
import { producer } from "../characters/producer.ts";

type AgentRole = "advertiser" | "influencer" | "producer";

export function generateCharacter(
  id: string,
  name: string,
  role: AgentRole
): Character {
  const templates = {
    advertiser,
    influencer,
    producer,
  };

  if (!templates[role]) {
    throw new Error("Invalid role");
  }

  return {
    ...templates[role],
    id: id as Character["id"],
    name,
  };
}
