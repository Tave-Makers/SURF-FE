import { HomeEventPropsMap } from '../model/constants';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackHomeEvent = createDomainTracker<HomeEventPropsMap>();
