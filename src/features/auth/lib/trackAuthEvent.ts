import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { AuthEventPropsMap } from '../model/types';

export const trackAuthEvent = createDomainTracker<AuthEventPropsMap>();
