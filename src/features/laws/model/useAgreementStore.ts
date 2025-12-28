import { create } from 'zustand';

interface AgreementState {
  agreements: {
    laws1: boolean;
    laws2: boolean;
    laws3: boolean;
  };
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
