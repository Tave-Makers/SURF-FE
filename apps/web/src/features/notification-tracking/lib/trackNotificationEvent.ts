import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { NotificationEventPropsMap } from '../model/constants';

export const trackNotificationEvent = createDomainTracker<NotificationEventPropsMap>();
