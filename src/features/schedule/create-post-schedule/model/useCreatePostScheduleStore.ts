import { create } from 'zustand';
import type { ScheduleFormData } from '@/features/schedule/create/model/types';

type CreatePostScheduleState = {
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (schedule: ScheduleFormData) => void;
  clearLinkedSchedule: () => void;
};

export const useCreatePostScheduleStore = create<CreatePostScheduleState>((set) => ({
  linkedSchedule: null,
  setLinkedSchedule: (schedule) => set({ linkedSchedule: schedule }),
  clearLinkedSchedule: () => set({ linkedSchedule: null }),
}));
