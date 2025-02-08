import { Injectable } from '@nestjs/common';
import { InjectJwtService } from '@libs/jwt/decorators';
import { JwtService } from '@libs/jwt/services';
import { SessionTokenData } from '@apps/platform/sessions/types';
import { ConfigService } from '@nestjs/config';

export interface SessionTokenService {
  generate(userId: string, organizationId: string): Promise<string>;
  verify(token: string): Promise<SessionTokenData | null>;
}

@Injectable()
export class DefaultSessionTokenService implements SessionTokenService {
  private readonly SESSION_TOKEN_EXPIRES_IN = this.configService.getOrThrow<number>('SESSION_TOKEN_EXPIRES_IN');

  constructor(
    @InjectJwtService() private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async verify(token: string) {
    return this.jwtService.verify<SessionTokenData>(token);
  }

  public async generate(userId: string, organizationId: string) {
    return this.jwtService.sign<SessionTokenData>(
      {
        userId,
        organizationId,
      },
      {
        expiresIn: this.SESSION_TOKEN_EXPIRES_IN,
      },
    );
  }
}
