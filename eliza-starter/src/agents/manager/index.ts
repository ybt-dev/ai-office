import { AgentRuntime } from "@elizaos/core";

class ExtendedAgentRuntime extends AgentRuntime {
    organizationId: string;
    role: string;
}
class AgentManager {
    rolesIndex: Map<string, string>;
    agents: Map<string, ExtendedAgentRuntime>;

    constructor() {
      this.agents = new Map();
      this.rolesIndex = new Map();
    }

    addAgent(id, agent, organizationId?: string, role?: string) {
      if (!this.agents.has(id)) {
        this.agents.set(id, agent);
        this.rolesIndex.set(`${organizationId}-${role}`, id);

        console.log(`Agent ${id} added.`);
      } else {
        console.log(`Agent ${id} already exists.`);
      }
    }

    removeAgent(id) {
        const agent = this.getAgent(id);

        if (!agent) {
            return;
        }

        this.rolesIndex.delete(this.createRolesIndexKey(agent.organizationId, agent.role));
      this.agents.delete(id);
    }

    getAgent(id) {
      return this.agents.get(id);
    }

    getAgentByRole(organizationId: string, role: string) {
        const rolesId = `${organizationId}-${role}`;

        if (!rolesId) {
            return undefined;
        }

        console.log("All rolesIndex", Array.from(this.rolesIndex.values()));
        const agentId = this.rolesIndex.get(rolesId);
        const agent = this.getAgent(agentId);
        return this.getAgent(agentId);
    }

    hasAgent(id) {
        return this.agents.has(id);
    }

    getAllAgents() {
      return Array.from(this.agents.values());
    }

    findAgents(id) {
      return this.agents.has(id)
    }

    async performTask(id, taskFunction) {
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

    createRolesIndexKey(organizationId, role) {
        return `${organizationId}-${role}`;
    }
  }

const agentsManager = new AgentManager();

export {
    agentsManager,
    AgentManager
}
