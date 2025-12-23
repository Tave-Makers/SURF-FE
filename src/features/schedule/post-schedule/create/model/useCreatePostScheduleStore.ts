import { create } from 'zustand';
import type { ScheduleFormData } from '@/features/schedule/create/model/types';

type CreatePostScheduleState = {
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (schedule: ScheduleFormData) => void;
  clearLinkedSchedule: () => void;
};

type PostReservationState = {
  reserved: boolean;
  reservedAt: Date | null;
  setReserved: (reserved: boolean) => void;
  setReservedAt: (date: Date | null) => void;
  resetReservation: () => void;
};

export const useCreatePostScheduleStore = create<CreatePostScheduleState>((set) => ({
  linkedSchedule: null,
  setLinkedSchedule: (schedule) => set({ linkedSchedule: schedule }),
  clearLinkedSchedule: () => set({ linkedSchedule: null }),
}));

export const usePostReservationStore = create<PostReservationState>((set) => ({
  reserved: false,
  reservedAt: null,
  setReserved: (reserved) => set({ reserved }),
  setReservedAt: (date) => set({ reservedAt: date }),
  resetReservation: () => set({ reserved: false, reservedAt: null }),
}));
