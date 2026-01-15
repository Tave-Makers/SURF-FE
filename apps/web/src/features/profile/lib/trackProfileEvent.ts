import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { ProfileEventPropsMap } from '@/features/profile/model/types';

export const trackProfileEvent = createDomainTracker<ProfileEventPropsMap>();
