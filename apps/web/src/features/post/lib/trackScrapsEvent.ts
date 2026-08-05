import { ScrapsEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackScrapsEvent = createDomainTracker<ScrapsEventPropsMap>();
