const AgentsModuleTokens = {
  Services: {
    AgentTeamService: Symbol('AgentTeamService'),
    AgentService: Symbol('AgentService'),
  },
  Repositories: {
    AgentTeamRepository: Symbol('AgentTeamRepository'),
    AgentRepository: Symbol('AgentRepository'),
  },
  EntityMappers: {
    AgentTeamEntityToDtoMapper: Symbol('AgentTeamEntityToDtoMapper'),
    AgentEntityToDtoMapper: Symbol('AgentEntityToDtoMapper'),
  },
};

export default AgentsModuleTokens;
