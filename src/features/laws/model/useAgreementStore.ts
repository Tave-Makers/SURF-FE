import { create } from 'zustand';

export type AgreementId = 'laws1' | 'laws2' | 'laws3';

interface AgreementState {
  agreements: Record<AgreementId, boolean>;
  setAgreement: (id: string, checked: boolean) => void;
  resetAgreements: () => void; // 동의 여부 초기화용
}

export const useAgreementStore = create<AgreementState>((set) => ({
  agreements: {
    laws1: false,
    laws2: false,
    laws3: false,
  },
  setAgreement: (id, checked) =>
    set((state) => ({
      agreements: { ...state.agreements, [id]: checked },
    })),
  resetAgreements: () =>
    set({
      agreements: { laws1: false, laws2: false, laws3: false },
    }),
}));
