import { BylawsEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackBylawsEvent = createDomainTracker<BylawsEventPropsMap>();
