import { OnBoardingEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackOnBoardingEvent = createDomainTracker<OnBoardingEventPropsMap>();
