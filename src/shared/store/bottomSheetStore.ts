import { create } from 'zustand';

// Registry Pattern: Features will augment this interface
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BottomSheetMap {}

export type BottomSheetType = keyof BottomSheetMap;

export type BottomSheetPayload = {
  [K in BottomSheetType]: {
    type: K;
    props: BottomSheetMap[K];
  };
}[BottomSheetType];

type BottomSheetStore = {
  current: BottomSheetPayload | null;
  open: (payload: BottomSheetPayload) => void;
  close: () => void;
};

export const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  current: null,
  open: (payload) => set({ current: payload }),
  close: () => set({ current: null }),
}));
