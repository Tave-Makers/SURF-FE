export type LawBottomSheetProps = {
  onClose: () => void;
  isOpen: boolean;
  onClickPrimaryBtn: () => void;
  agreements: { [key: string]: boolean };
  onCheck: (id: string, checked: boolean) => void;
  onClickLawDetail: (id: string) => void;
  allAgreed: boolean;
};
