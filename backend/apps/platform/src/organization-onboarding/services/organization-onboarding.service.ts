import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { InjectSessionLinkService } from '@apps/platform/sessions/decorators';
import { SessionLinkService } from '@apps/platform/sessions/services';
import { InjectOrganizationService } from '@apps/platform/organizations/decorators';
import { OrganizationService } from '@apps/platform/organizations/services';
import { InjectUserService } from '@apps/platform/users/decorators';
import { UserService } from '@apps/platform/users/services';

export interface RegisterOrganizationParams {
  userEmail: string;
  userFirstName?: string;
  userLastName?: string;
}

export interface OrganizationOnboardingService {
  register(params: RegisterOrganizationParams): Promise<void>;
}

@Injectable()
export class DefaultOrganizationOnboardingService implements OrganizationOnboardingService {
  constructor(
    @InjectOrganizationService() private readonly organizationService: OrganizationService,
    @InjectUserService() private readonly userService: UserService,
    @InjectSessionLinkService() private readonly sessionLinkService: SessionLinkService,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
    private readonly mailerService: MailerService,
  ) {}

  public async register(params: RegisterOrganizationParams) {
    const user = await this.transactionsManager.useTransaction(async () => {
      const organization = await this.organizationService.create({
        name: `${params.userFirstName} ${params.userLastName} Organization - ${new Date().toISOString()}`,
      });

      return this.userService.create({
        organizationId: organization.id,
        email: params.userEmail,
        firstName: params.userFirstName,
        lastName: params.userLastName,
      });
    });

    const sessionLink = await this.sessionLinkService.generateSessionLink(user.id, user.organizationId);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to the platform',
      text: `Welcome to the platform! Please click the following link to complete your registration: ${sessionLink}`,
    });
  }
}
