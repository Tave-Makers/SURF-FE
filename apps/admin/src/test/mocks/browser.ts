import { setupWorker } from 'msw/browser';
import { memberByGenerationHandlers } from './handlers/memberByGeneration';
import { signupRequestHandlers } from './handlers/signupRequest';

export const worker = setupWorker(...signupRequestHandlers, ...memberByGenerationHandlers);
