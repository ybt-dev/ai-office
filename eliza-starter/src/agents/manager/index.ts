import { IAgentRuntime } from "@elizaos/core";
import { ADVERTISER_AGENT_ID } from "../../characters/advertiser.ts";
import { INFLUENCER_AGENT_ID } from "../../characters/influencer.ts";
import { PRODUCER_AGENT_ID } from "../../characters/producer.ts";

const agentName = {
    advertiser: ADVERTISER_AGENT_ID,
    producer: PRODUCER_AGENT_ID,
    influencer: INFLUENCER_AGENT_ID
}

class AgentManager {
    agents: Map<keyof typeof agentName, IAgentRuntime>;
    
    constructor() {
      this.agents = new Map();
    }
  
    addAgent(name, agent) {
      if (!this.agents.has(name)) {
        this.agents.set(name, agent);
        console.log(`Agent ${name} added.`);
      } else {
        console.log(`Agent ${name} already exists.`);
      }
    }
  
    getAgent(name) {
      return this.agents.get(name);
    }
  
    getAllAgents() {
      return Array.from(this.agents.values());
    }
  
    async performTask(name, taskFunction) {
      const agent = this.getAgent(name);
      if (!agent) {
        throw new Error(`Agent ${name} not found.`);
      }
      try {
        return await taskFunction(agent);
      } catch (error) {
        console.error(`Error performing task with agent ${name}:`, error);
        throw error;
      }
    }
  }
  
const agentsManager = new AgentManager();

export {
    agentsManager,
    AgentManager
}