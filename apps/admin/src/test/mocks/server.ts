import { setupServer } from 'msw/node';
import { signupRequestHandlers } from './handlers/signupRequest';

export const server = setupServer(...signupRequestHandlers);
