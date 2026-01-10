import { create } from 'zustand';
import { LawBottomSheetProps } from '@/features/laws/ui/LawBottomSheet';

export type BottomSheetPropsMap = {
  law: Omit<LawBottomSheetProps, 'isOpen' | 'onClose'>;
  // 게시글 수정삭제 / 일정 수정삭제 추가 정의
  // postOption: Omit<PostOptionSheetProps, 'isOpen' | 'onClose'>;
};

export type BottomSheetType = keyof BottomSheetPropsMap;

export type BottomSheetPayload = {
  [K in BottomSheetType]: {
    type: K;
    props: BottomSheetPropsMap[K];
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
