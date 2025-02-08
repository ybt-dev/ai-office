import { Module } from '@nestjs/common';
import { OrganizationsModule } from '@apps/platform/organizations';
import { UsersModule } from '@apps/platform/users';
import { SessionsModule } from '@apps/platform/sessions';
import { TransactionsModule } from '@libs/transactions';
import { DefaultOrganizationOnboardingService } from './services';
import { OrganizationController } from './controllers';
import OrganizationOnboardingModuleTokens from './organization-onboarding.module.tokens';

@Module({
  imports: [TransactionsModule, SessionsModule, OrganizationsModule, UsersModule],
  controllers: [OrganizationController],
  providers: [
    {
      provide: OrganizationOnboardingModuleTokens.Services.OrganizationOnboardingService,
      useClass: DefaultOrganizationOnboardingService,
    },
  ],
  exports: [OrganizationOnboardingModuleTokens.Services.OrganizationOnboardingService],
})
export class OrganizationOnboardingModule {
  public static Tokens = OrganizationOnboardingModuleTokens;
}
