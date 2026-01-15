import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AgreementId = 'laws1' | 'laws2' | 'laws3';

export interface AgreementState {
  agreements: Record<AgreementId, boolean>;
  isAgreed: boolean;
  setAgreement: (id: string, checked: boolean) => void;
  setAgreed: (agreed: boolean) => void;
  resetAgreements: () => void; // 동의 여부 초기화용
}

export const useAgreementStore = create(
  persist<AgreementState>(
    (set) => ({
      agreements: {
        laws1: false,
        laws2: false,
        laws3: false,
      },
      isAgreed: false,
      setAgreement: (id: string, checked: boolean) =>
        set((state: AgreementState) => ({
          agreements: { ...state.agreements, [id]: checked },
        })),
      setAgreed: (agreed: boolean) => set({ isAgreed: agreed }),
      resetAgreements: () =>
        set({
          agreements: { laws1: false, laws2: false, laws3: false },
          isAgreed: false,
        }),
    }),
    {
      name: 'agreement-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
