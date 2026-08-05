import { create } from 'zustand';

/**
 * Bottom Sheet System Guide
 * 1. 바텀 시트 컴포넌트 구현
 *
 * 2. 타입 선언 (구현한 바텀 시트 컴포넌트 파일 내에 선언)
 * - 이 선언이 있어야 open() 호출 시 type 자동완성과 props 타입 체크가 동작합니다.
 * - 키('law')는 사용할 바텀 시트의 고유 식별자이며, SHEET_COMPONENTS의 키와 일치해야 합니다.
 * - 값은 컴포넌트의 Props 타입을 지정하되, 스토어가 제어하는 'isOpen', 'onClose'는 Omit으로 제외합니다.
 *
 * 예)
 * declare module '@/shared/store/bottomSheetStore' {
 *   interface BottomSheetMap {
 *     law: Omit<LawBottomSheetProps, 'isOpen' | 'onClose'>;
 *   }
 * }
 *
 * 3. SHEET_COMPONENTS 객체에 구현한 바텀 시트 컴포넌트를 원하는 키값과 추가
 * - const SHEET_COMPONENTS = { law: LawBottomSheet, [newType]: NewBottomSheet };
 *
 * 4. 바텀 시트를 사용하는 페이지에서 useBottomSheetStore 를 사용하여 시트를 열고 닫기
 * - const open = useBottomSheetStore((s) => s.open);
 * - const close = useBottomSheetStore((s) => s.close);
 * - props는 해당 type(키)에 맞는 props를 작성(타입 체크 됨)
 */

// Registry Pattern: Features will augment this interface
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
