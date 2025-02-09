import { SiweMessage, generateNonce } from 'siwe';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { InjectUserService } from '@apps/platform/users/decorators';
import { InjectOrganizationService } from '@apps/platform/organizations/decorators';
import { InjectSessionNonceRepository } from '@apps/platform/sessions/decorators';
import { UserService } from '@apps/platform/users/services';
import { SessionData } from '@apps/platform/sessions/types';
import { OrganizationService } from '@apps/platform/organizations/services';
import { SessionNonceRepository } from '@apps/platform/sessions/repositories';

export interface CreateSessionParams {
  message: string;
  signature: string;
}

export interface SessionService {
  generateNonce(): Promise<string>;
  create(params: CreateSessionParams): Promise<SessionData>;
}

@Injectable()
export class DefaultSessionService implements SessionService {
  constructor(
    @InjectUserService() private readonly userService: UserService,
    @InjectSessionNonceRepository() private readonly sessionNonceRepository: SessionNonceRepository,
    @InjectOrganizationService() private readonly organizationService: OrganizationService,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
  ) {}

  public async generateNonce() {
    const nonce = generateNonce();

    await this.sessionNonceRepository.createOne(nonce);

    return nonce;
  }

  public async create(params: CreateSessionParams) {
    const siwe = new SiweMessage(params.message);
    const fields = await siwe.verify({ signature: params.signature });

    if (!fields.success) {
      throw new UnauthorizedException('Failed to verify signature.');
    }

    const nonceExists = await this.sessionNonceRepository.existsByValue(fields.data.nonce);

    if (!nonceExists) {
      throw new UnauthorizedException('Invalid nonce provided.');
    }

    await this.sessionNonceRepository.deleteOne(fields.data.nonce);

    const user = await this.userService.getByAddress(fields.data.address);

    if (user) {
      return { userId: user.id, organizationId: user.organizationId };
    }

    return this.transactionsManager.useTransaction(async () => {
      const organization = await this.organizationService.create({ name: `${fields.data.address}` });

      const newUser = await this.userService.create({
        address: fields.data.address,
        organizationId: organization.id,
      });

      return { userId: newUser.id, organizationId: newUser.organizationId };
    });
  }
}
