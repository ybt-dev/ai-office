// This module should be imported first.
import './instrument';

import * as Joi from 'joi';
import { SentryModule } from '@sentry/nestjs/setup';
import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from '@libs/health';
import { LoggerMiddleware } from '@libs/logging/middlewares';
import { TransactionsModule } from '@libs/transactions';
import { MongodbTransactionsManager, MongodbTransactionsModule } from '@libs/mongodb-transactions';
import { AgentsModule } from '@apps/platform/agents';
import { OrganizationOnboardingModule } from '@apps/platform/organization-onboarding';
import { SessionsModule } from '@apps/platform/sessions';

@Module({
  imports: [
    HealthModule,
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        DATABASE_CONNECTION_URL: Joi.string().required(),
        APPLICATION_ORIGIN: Joi.string().required(),
        COOKIE_DOMAIN: Joi.string().optional(),
        SESSIONS_SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        SESSION_TOKEN_EXPIRES_IN: Joi.number().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_CONNECTION_URL'),
      }),
    }),
    TransactionsModule.forRoot({
      imports: [MongodbTransactionsModule],
      useExistingTransactionsManager: MongodbTransactionsManager,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.mailersend.net',
          port: 587,
          secure: false,
          auth: {
            user: 'MS_HmYFus@trial-o65qngknrmwgwr12.mlsender.net',
            pass: 'mssp.SZVb6fB.vywj2lpznzkg7oqz.upitEtx',
          },
        },
        defaults: {
          from: 'support@trial-o65qngknrmwgwr12.mlsender.net',
        },
      }),
    }),
    AgentsModule,
    OrganizationOnboardingModule,
    SessionsModule,
  ],
})
export class PlatformModule {
  constructor() {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).exclude('/health').forRoutes('*');
  }
}
