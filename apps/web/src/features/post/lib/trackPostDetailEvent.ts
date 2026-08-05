import { PostDetailEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackPostDetailEvent = createDomainTracker<PostDetailEventPropsMap>();
