import { createDomainTracker } from '@/shared/lib/createDomainTracker';
import { CalendarEventPropsMap } from '../model/constants';

export const trackCalendarEvent = createDomainTracker<CalendarEventPropsMap>();
