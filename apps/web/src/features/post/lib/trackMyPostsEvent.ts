import { MyPostsEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackMyPostsEvent = createDomainTracker<MyPostsEventPropsMap>();
