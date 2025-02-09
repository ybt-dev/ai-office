import { Controller, Post, Body } from '@nestjs/common';
import { InjectOrganizationOnboardingService } from '@apps/platform/organization-onboarding/decorators';
import { OrganizationOnboardingService } from '@apps/platform/organization-onboarding/services';
import { RegisterOrganizationDto } from '@apps/platform/organization-onboarding/dto';

@Controller('/organization-onboarding')
export default class OrganizationOnboardingController {
  constructor(
    @InjectOrganizationOnboardingService()
    private readonly organizationOnboardingService: OrganizationOnboardingService,
  ) {}

  @Post('/')
  public async registerOrganization(@Body() body: RegisterOrganizationDto) {
    const user = await this.organizationOnboardingService.register({
      userFirstName: body.userFirstName,
      userLastName: body.userLastName,
      userEmail: body.userEmail,
    });

    return { user };
  }
}
