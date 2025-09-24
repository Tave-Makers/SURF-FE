import { create } from 'zustand';
import type { UserOnboardingData } from './types';

type OnboardingState = {
  data: UserOnboardingData;
  updateData: (updates: Partial<UserOnboardingData>) => void;
  resetData: () => void;
};

const initialState = { name: '', profileImage: null };

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data: initialState,
  updateData: (updates) => set((state) => ({ data: { ...state.data, ...updates } })),
  resetData: () => set({ data: initialState }),
}));
