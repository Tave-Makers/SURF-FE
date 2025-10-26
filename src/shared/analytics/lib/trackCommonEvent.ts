import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { CommonEventPropsMap } from '../model/types';

export const trackCommonEvent = createDomainTracker<CommonEventPropsMap>();
