import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectUserService } from '@apps/platform/users/decorators';
import { InjectSessionTokenService, InjectSessionLinkService } from '@apps/platform/sessions/decorators';
import { UserService } from '@apps/platform/users/services';
import { SessionData } from '@apps/platform/sessions/types';
import { SessionTokenService } from './session-token.service';
import { SessionLinkService } from './session-link.service';

export interface SessionService {
  sendSessionLink(email: string): Promise<void>;
  create(token: string): Promise<SessionData>;
}

@Injectable()
export class DefaultSessionService implements SessionService {
  constructor(
    @InjectUserService() private readonly userService: UserService,
    @InjectSessionTokenService() readonly sessionTokenService: SessionTokenService,
    @InjectSessionLinkService() readonly sessionLinkService: SessionLinkService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendSessionLink(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      return;
    }

    const sessionLink = await this.sessionLinkService.generateSessionLink(user.id, user.organizationId);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Sign In Link',
      text: `Your Sign-In Link: ${sessionLink}`,
    });
  }

  public async create(token: string) {
    const tokenData = await this.sessionTokenService.verify(token);

    if (!tokenData) {
      throw new UnauthorizedException('Token is invalid or expired.');
    }

    const user = await this.userService.getById(tokenData.userId);

    if (!user) {
      throw new UnauthorizedException('Invalid token data provided.');
    }

    return { userId: user.id, organizationId: user.organizationId };
  }
}
