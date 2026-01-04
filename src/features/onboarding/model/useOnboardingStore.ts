import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OnboardingInitData, OnboardingState } from './types';

const initialState: OnboardingInitData = {
  nickname: null,
  email: null,
  profileImageUrl: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setOnboarding: (auth) => set((state) => ({ ...state, ...auth })),
      clearOnboarding: () => set(initialState),
    }),
    {
      name: 'SURF-onboarding',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
