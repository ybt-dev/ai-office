import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectSessionTokenService } from '@apps/platform/sessions/decorators';
import { SessionTokenService } from './session-token.service';

export interface SessionLinkService {
  generateSessionLink(userId: string, organizationId: string): Promise<string>;
}

@Injectable()
export class DefaultSessionLinkService implements SessionLinkService {
  private readonly APPLICATION_URL = this.configService.get('APPLICATION_ORIGIN');

  constructor(
    @InjectSessionTokenService() private readonly sessionTokenService: SessionTokenService,
    private configService: ConfigService,
  ) {}

  public async generateSessionLink(userId: string, organizationId: string) {
    const token = await this.sessionTokenService.generate(userId, organizationId);

    return `${this.APPLICATION_URL}/session-verification?token=${token}`;
  }
}
