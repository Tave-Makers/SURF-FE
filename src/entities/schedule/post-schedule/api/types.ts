import { scheduleResDTO } from '@/features/calendar/api/types';
import { CommonResponse } from '@/shared/api/types';

export type PostScheduleData = scheduleResDTO;

export type PostScheduleResponse = CommonResponse<PostScheduleData>;
