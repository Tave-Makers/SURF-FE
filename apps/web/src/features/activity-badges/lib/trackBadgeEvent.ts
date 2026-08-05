import { BadgeEventPropsMap } from '@/features/activity-badges/model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackBadgeEvent = createDomainTracker<BadgeEventPropsMap>();
