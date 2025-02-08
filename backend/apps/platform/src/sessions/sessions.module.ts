import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@libs/jwt';
import { UsersModule } from '@apps/platform/users';
import { SessionController } from './controllers';
import { DefaultSessionService, DefaultSessionLinkService, DefaultSessionTokenService } from './services';
import SessionsModuleTokens from './sessions.module.tokens';

@Module({
  imports: [ConfigModule, UsersModule, JwtModule],
  controllers: [SessionController],
  providers: [
    {
      provide: SessionsModuleTokens.Services.SessionService,
      useClass: DefaultSessionService,
    },
    {
      provide: SessionsModuleTokens.Services.SessionLinkService,
      useClass: DefaultSessionLinkService,
    },
    {
      provide: SessionsModuleTokens.Services.SessionTokenService,
      useClass: DefaultSessionTokenService,
    },
  ],
  exports: [
    SessionsModuleTokens.Services.SessionService,
    SessionsModuleTokens.Services.SessionLinkService,
    SessionsModuleTokens.Services.SessionTokenService,
  ],
})
export class SessionsModule {}
