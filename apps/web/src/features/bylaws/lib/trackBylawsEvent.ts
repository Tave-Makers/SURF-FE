import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { BylawsEventPropsMap } from '../model/types';

export const trackBylawsEvent = createDomainTracker<BylawsEventPropsMap>();
