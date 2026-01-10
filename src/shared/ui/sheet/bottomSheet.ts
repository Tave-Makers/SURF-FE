/**
 * LawBottomSheetProps (약관 동의 바텀 시트의 Props 타입 정의)
 * @property onClose - 바텀 시트 닫기 핸들러
 * @property isOpen - 바텀 시트 표시 여부
 * @property onClickPrimaryBtn - 약관 동의 후 '동의하고 시작하기' 버튼 클릭 핸들러
 * @property agreements - 각 약관 항목별 동의 상태 (key: 약관 ID, value: 동의 여부)
 * @property onCheck - 개별 약관 체크박스 변경 핸들러
 * @property onClickLawDetail - 약관 상세보기 클릭 핸들러
 * @property allAgreed - 모든 필수 약관 동의 완료 여부
 */

export type LawBottomSheetProps = {
  onClose: () => void;
  isOpen: boolean;
  onClickPrimaryBtn: () => void;
  agreements: { [key: string]: boolean };
  onCheck: (id: string, checked: boolean) => void;
  onClickLawDetail: (id: string) => void;
  allAgreed: boolean;
};
