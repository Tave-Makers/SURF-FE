import { create } from 'zustand';
import type { ScheduleFormData } from '@/features/calendar/schedule/post/model/types';

type PostScheduleState = {
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (schedule: ScheduleFormData) => void;
  clearLinkedSchedule: () => void;
};

export const usePostScheduleStore = create<PostScheduleState>((set) => ({
  linkedSchedule: null,
  setLinkedSchedule: (schedule) => set({ linkedSchedule: schedule }),
  clearLinkedSchedule: () => set({ linkedSchedule: null }),
}));
