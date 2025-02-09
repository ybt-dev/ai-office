import { Controller, Post, Session as SessionControl, Body, Get } from '@nestjs/common';
import * as secureSession from '@fastify/secure-session';
import { SessionService } from '@apps/platform/sessions/services';
import { InjectSessionService, Session } from '@apps/platform/sessions/decorators';
import { CreateSessionDto, CreateSessionTokenDto } from '@apps/platform/sessions/dto';
import { InjectUserService } from '@apps/platform/users/decorators';
import { UserService } from '@apps/platform/users/services';
import { SessionData } from '@apps/platform/sessions/types';

declare module '@fastify/secure-session' {
  interface SessionData {
    userId: string;
    organizationId: string;
  }
}

@Controller('sessions')
export default class SessionController {
  constructor(
    @InjectSessionService() private readonly sessionService: SessionService,
    @InjectUserService() private readonly userService: UserService,
  ) {}

  @Post('/token')
  public async createSessionToken(@Body() body: CreateSessionTokenDto) {
    await this.sessionService.sendSessionLink(body.email);

    return { success: true };
  }

  @Post('/')
  public async createSession(@SessionControl() session: secureSession.Session, @Body() body: CreateSessionDto) {
    const { organizationId, userId } = await this.sessionService.create(body.token);

    session.set('userId', userId);
    session.set('organizationId', organizationId);

    return { success: true };
  }

  @Get('/')
  public async getCurrentSession(@Session() session: SessionData) {
    if (session.userId === undefined) {
      return { sessionUser: null };
    }

    return { sessionUser: await this.userService.getById(session.userId) };
  }
}
