import { setupServer, type SetupServerApi } from 'msw/node';
import { signupRequestHandlers } from './handlers/signupRequest';

export const server: SetupServerApi = setupServer(...signupRequestHandlers);
