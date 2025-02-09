import { Inject } from '@nestjs/common';
import SessionsModuleTokens from '@apps/platform/sessions/sessions.module.tokens';

const InjectSessionTokenService = () => {
  return Inject(SessionsModuleTokens.Services.SessionTokenService);
};

export default InjectSessionTokenService;
