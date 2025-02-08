import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { UserRepository } from '@apps/platform/users/repositories';
import { InjectUserRepository, InjectUserEntityToDtoMapper } from '@apps/platform/users/decorators';
import { UserDto } from '@apps/platform/users/dto';
import { UserEntityToDtoMapper } from '@apps/platform/users/entities-mappers';

export interface CreateUserParams {
  email: string;
  organizationId: string;
  firstName?: string;
  lastName?: string;
}

export interface UserService {
  getById(id: string): Promise<UserDto | null>;
  getByEmail(email: string): Promise<UserDto | null>;
  create(params: CreateUserParams): Promise<UserDto>;
}

@Injectable()
export class DefaultUserService implements UserService {
  constructor(
    @InjectUserRepository() private readonly userRepository: UserRepository,
    @InjectUserEntityToDtoMapper() private userEntityToDtoMapper: UserEntityToDtoMapper,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager,
  ) {}

  public async getById(id: string) {
    const user = await this.userRepository.findById(id);

    return user && this.userEntityToDtoMapper.mapOne(user);
  }

  public async getByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    return user && this.userEntityToDtoMapper.mapOne(user);
  }

  public async create(params: CreateUserParams) {
    return this.transactionsManager.useTransaction(async () => {
      const existingUser = await this.userRepository.findByEmail(params.email);

      if (existingUser) {
        throw new UnprocessableEntityException('User with this email already exists.');
      }

      const user = await this.userRepository.createOne({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        organization: params.organizationId,
      });

      return this.userEntityToDtoMapper.mapOne(user);
    });
  }
}
