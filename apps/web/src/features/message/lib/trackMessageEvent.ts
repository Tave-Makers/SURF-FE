import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { MessageEventPropsMap } from '../model/types';

export const trackMessageEvent = createDomainTracker<MessageEventPropsMap>();
