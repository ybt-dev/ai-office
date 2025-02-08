import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from '@libs/transactions';
import { AgentTeam, Agent, AgentTeamSchema, AgentSchema } from './schemas';
import { DefaultAgentService, DefaultAgentTeamService } from './services';
import { AgentTeamController, AgentController } from './controllers';
import { MongoAgentRepository, MongoAgentTeamRepository } from './repositories';
import { DefaultAgentEntityToDtoMapper, DefaultAgentTeamEntityToDtoMapper } from './entities-mappers';
import AgentsModuleTokens from './agents.module.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AgentTeam.name, schema: AgentTeamSchema }]),
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
    ConfigModule,
    TransactionsModule,
  ],
  controllers: [AgentTeamController, AgentController],
  providers: [
    {
      provide: AgentsModuleTokens.Services.AgentTeamService,
      useClass: DefaultAgentTeamService,
    },
    {
      provide: AgentsModuleTokens.Repositories.AgentTeamRepository,
      useClass: MongoAgentTeamRepository,
    },
    {
      provide: AgentsModuleTokens.EntityMappers.AgentTeamEntityToDtoMapper,
      useClass: DefaultAgentTeamEntityToDtoMapper,
    },
    {
      provide: AgentsModuleTokens.Services.AgentService,
      useClass: DefaultAgentService,
    },
    {
      provide: AgentsModuleTokens.Repositories.AgentRepository,
      useClass: MongoAgentRepository,
    },
    {
      provide: AgentsModuleTokens.EntityMappers.AgentEntityToDtoMapper,
      useClass: DefaultAgentEntityToDtoMapper,
    },
  ],
  exports: [AgentsModuleTokens.Services.AgentTeamService],
})
export class AgentsModule {
  public static Tokens = AgentsModuleTokens;
}
