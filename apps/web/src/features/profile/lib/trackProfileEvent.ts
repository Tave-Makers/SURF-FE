import { ProfileEventPropsMap } from '@/features/profile/model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackProfileEvent = createDomainTracker<ProfileEventPropsMap>();
