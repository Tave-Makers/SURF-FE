import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { ActivityScoreEventPropsMap } from '../model/types';

export const trackActivityScoreEvent = createDomainTracker<ActivityScoreEventPropsMap>();
