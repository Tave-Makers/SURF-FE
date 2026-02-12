import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { PostDetailEventPropsMap } from '../model/types';

export const trackPostDetailEvent = createDomainTracker<PostDetailEventPropsMap>();
