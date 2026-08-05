import { AuthEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackAuthEvent = createDomainTracker<AuthEventPropsMap>();
