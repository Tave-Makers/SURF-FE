import { CommonEventPropsMap } from '../model/types';
import { createDomainTracker } from '@/shared/lib/createDomainTracker';

export const trackCommonEvent = createDomainTracker<CommonEventPropsMap>();
