import { create } from 'zustand';

/**
 * Bottom Sheet System Guide
 * 1. 새로운 바텀 시트 등록하기
 * - 새로운 종류의 바텀 시트를 만들고 싶다면, 먼저 타입을 등록
 * 예) lawBottomSheetSchema.ts와 같이
 * src/features/xxx/model/schema.ts같은 곳에서 기존에 구현된 바텀 시트 props의 타입을 가져와서 선언
 *
 * 2. 바텀 시트 컴포넌트 구현
 * 3. SHEET_COMPONENTS 객체에 컴포넌트 추가
 * - const SHEET_COMPONENTS = { law: LawBottomSheet, [newType]: NewBottomSheet };
 *
 * 4. 바텀 시트를 사용하는 페이지에서 useBottomSheetStore 를 사용하여 시트를 열고 닫기
 *    - const open = useBottomSheetStore((s) => s.open);
 *    - const close = useBottomSheetStore((s) => s.close);
 *
 * 5. props는 해당 type(키)에 맞는 props를 작성(타입 체크 됨)
 */

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
