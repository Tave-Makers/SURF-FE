import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { MemberSearchEventPropsMap } from '@/features/member-search/model/constants';

export const trackMemberSearchEvent = createDomainTracker<MemberSearchEventPropsMap>();
