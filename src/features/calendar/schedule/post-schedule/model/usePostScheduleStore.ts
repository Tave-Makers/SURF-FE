import { create } from 'zustand';
import type { ScheduleFormData } from '@/features/calendar/schedule/post/model/types';

type PostScheduleState = {
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (schedule: ScheduleFormData) => void;
  clearLinkedSchedule: () => void;
  reserved: boolean;
  reservedAt: Date | null;
  setReserved: (reserved: boolean) => void;
  setReservedAt: (date: Date | null) => void;
  resetPostState: () => void;
};

export const usePostScheduleStore = create<PostScheduleState>((set) => ({
  linkedSchedule: null,
  reserved: false,
  reservedAt: null,
  setReserved: (reserved) => set({ reserved }),
  setReservedAt: (date) => set({ reservedAt: date }),
  resetPostState: () =>
    set({
      linkedSchedule: null,
      reserved: false,
      reservedAt: null,
    }),
  setLinkedSchedule: (schedule) => set({ linkedSchedule: schedule }),
  clearLinkedSchedule: () => set({ linkedSchedule: null }),
}));
