import { CommentEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackCommentEvent = createDomainTracker<CommentEventPropsMap>();
