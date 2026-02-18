import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { HomeEventPropsMap } from '../model/constants';

export const trackHomeEvent = createDomainTracker<HomeEventPropsMap>();
