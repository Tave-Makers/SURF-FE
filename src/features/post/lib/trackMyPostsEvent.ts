import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { MyPostsEventPropsMap } from '../model/types';

export const trackMyPostsEvent = createDomainTracker<MyPostsEventPropsMap>();
