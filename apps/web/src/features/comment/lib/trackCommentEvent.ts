import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { CommentEventPropsMap } from '../model/types';

export const trackCommentEvent = createDomainTracker<CommentEventPropsMap>();
