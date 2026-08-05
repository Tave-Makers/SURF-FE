import { MemberSearchEventPropsMap } from '@/features/member-search/model/constants';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackMemberSearchEvent = createDomainTracker<MemberSearchEventPropsMap>();
