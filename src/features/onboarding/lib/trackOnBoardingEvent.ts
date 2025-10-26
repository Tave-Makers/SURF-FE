import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { OnBoardingEventPropsMap } from '../model/types';

export const trackOnBoardingEvent = createDomainTracker<OnBoardingEventPropsMap>();
