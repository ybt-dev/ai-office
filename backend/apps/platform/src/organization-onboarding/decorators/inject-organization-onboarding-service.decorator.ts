import { Inject } from '@nestjs/common';
import OrganizationOnboardingModuleTokens from '@apps/platform/organization-onboarding/organization-onboarding.module.tokens';

const InjectOrganizationOnboardingService = () => {
  return Inject(OrganizationOnboardingModuleTokens.Services.OrganizationOnboardingService);
};

export default InjectOrganizationOnboardingService;
