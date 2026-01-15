import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ScheduleFormData } from '@/features/schedule/create/model/types';

type CreatePostScheduleState = {
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (schedule: ScheduleFormData) => void;
  clearLinkedSchedule: () => void;
};

export const useCreatePostScheduleStore = create<CreatePostScheduleState>()(
  persist(
    (set) => ({
      linkedSchedule: null,
      setLinkedSchedule: (schedule) => set({ linkedSchedule: schedule }),
      clearLinkedSchedule: () => set({ linkedSchedule: null }),
    }),
    {
      name: 'post-schedule-storage',
      storage: createJSONStorage(() => localStorage),
      // 저장된 데이터를 읽어올 때 실행되는 함수
      onRehydrateStorage: () => (state) => {
        if (state?.linkedSchedule) {
          // 문자열 날짜 -> Date 객체 복원
          state.linkedSchedule.startDate = new Date(state.linkedSchedule.startDate);
          state.linkedSchedule.endDate = new Date(state.linkedSchedule.endDate);
        }
      },
    },
  ),
);
