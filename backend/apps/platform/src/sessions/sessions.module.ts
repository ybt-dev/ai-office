import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from '@libs/transactions';
import { UsersModule } from '@apps/platform/users';
import { OrganizationsModule } from '@apps/platform/organizations';
import { SessionController } from './controllers';
import { DefaultSessionService } from './services';
import { MongoSessionNonceRepository } from './repositories';
import { SessionNonce, SessionNonceSchema } from './schemas';
import SessionsModuleTokens from './sessions.module.tokens';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    OrganizationsModule,
    TransactionsModule,
    MongooseModule.forFeature([{ name: SessionNonce.name, schema: SessionNonceSchema }]),
  ],
  controllers: [SessionController],
  providers: [
    {
      provide: SessionsModuleTokens.Services.SessionService,
      useClass: DefaultSessionService,
    },
    {
      provide: SessionsModuleTokens.Repositories.SessionNonceRepository,
      useClass: MongoSessionNonceRepository,
    },
  ],
  exports: [SessionsModuleTokens.Services.SessionService],
})
export class SessionsModule {}
