import { FeedbackEventPropsMap } from './../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackFeedbackEvent = createDomainTracker<FeedbackEventPropsMap>();
