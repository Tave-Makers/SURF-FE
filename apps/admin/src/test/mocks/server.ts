import { setupServer, type SetupServerApi } from 'msw/node';
import { memberByGenerationHandlers } from './handlers/memberByGeneration';
import { signupRequestHandlers } from './handlers/signupRequest';

export const server: SetupServerApi = setupServer(
  ...signupRequestHandlers,
  ...memberByGenerationHandlers,
);
