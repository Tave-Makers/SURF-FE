import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { FeedbackEventPropsMap } from './../model/types';

export const trackFeedbackEvent = createDomainTracker<FeedbackEventPropsMap>();
