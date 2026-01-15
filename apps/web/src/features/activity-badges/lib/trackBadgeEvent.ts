import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { BadgeEventPropsMap } from '@/features/activity-badges/model/types';

export const trackBadgeEvent = createDomainTracker<BadgeEventPropsMap>();
