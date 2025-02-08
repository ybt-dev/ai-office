import { Inject } from '@nestjs/common';
import SessionsModuleTokens from '@apps/platform/sessions/sessions.module.tokens';

const InjectSessionLinkService = () => {
  return Inject(SessionsModuleTokens.Services.SessionLinkService);
};

export default InjectSessionLinkService;
