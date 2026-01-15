import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { ScrapsEventPropsMap } from '../model/types';

export const trackScrapsEvent = createDomainTracker<ScrapsEventPropsMap>();
