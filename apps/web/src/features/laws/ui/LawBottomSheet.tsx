import { CheckList } from '@surf/ui/check-list';
import { Sheet } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { LAW_LIST } from '@/features/laws/constants/law-list';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    law: Omit<LawBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type LawBottomSheetProps = {
  onClose: () => void;
  isOpen: boolean;
  onClickPrimaryBtn: () => void;
  agreements: { [key: string]: boolean };
  onCheck: (id: string, checked: boolean) => void;
  onClickLawDetail: (id: string) => void;
  allAgreed: boolean;
};

export const LawBottomSheet = ({
  isOpen,
  onClose,
  agreements,
  onCheck,
  onClickPrimaryBtn,
  onClickLawDetail,
  allAgreed,
}: LawBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      disableDrag={true}
      className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
    >
      <ModalSheet.Container>
        <ModalSheet.Content>
          <Sheet
            title="SURF에 오신 것을 환영해요! 👋"
            description="서비스 시작을 위해 약관 내용을 확인하고 동의해 주세요."
            primaryBtn={{
              label: '동의하고 시작하기',
              onClick: onClickPrimaryBtn,
              disabled: allAgreed === false,
            }}
          >
            <div className="my-15 flex w-full flex-col gap-8 py-10">
              {LAW_LIST.map((law) => (
                <CheckList
                  key={law.id}
                  id={law.id}
                  title={law.title}
                  isChecked={agreements[law.id]}
                  onChange={(checked, id) => onCheck(id, checked)}
                  onClickItem={(id) => onClickLawDetail(id)}
                />
              ))}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop className="bg-effect-overlay-dim-normal touch-none" onClick={() => {}} />
    </ModalSheet>
  );
};
