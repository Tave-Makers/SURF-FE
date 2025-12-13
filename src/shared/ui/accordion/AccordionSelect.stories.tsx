import type { Meta, StoryObj } from '@storybook/nextjs';
import { usePicker } from '@/shared/hooks/usePicker';
import { AccordionSelect } from './AccordionSelect';
import { Sheet as ModalSheet } from 'react-modal-sheet';

const meta: Meta<typeof AccordionSelect> = {
  title: 'shared/ui/Accordion/AccordionSelect',
  component: AccordionSelect,
};

export default meta;
type Story = StoryObj<typeof AccordionSelect>;

/** 단순 시트 열기/닫기용 (토글형) */
export const ToggleAccordionSelect: Story = {
  render: () => {
    const { isOpen, open, close } = usePicker(); // open/close만 사용
    const sheetId = 'toggle-sheet';

    return (
      <div>
        <AccordionSelect
          title="열기/닫기 테스트"
          isOpen={isOpen}
          onClick={open}
          controlsId={sheetId}
        />

        <ModalSheet
          isOpen={isOpen}
          onClose={close}
          aria-labelledby={sheetId}
          className="flex w-full"
        >
          <ModalSheet.Container>
            <ModalSheet.Header />
            <ModalSheet.Content>
              <div id={sheetId} className="flex flex-col gap-[0.25rem] p-15">
                <p className="text-body-body6 text-foreground-foreground-normal">
                  이건 단순히 토글되는 시트입니다.
                </p>
                <p className="text-body-body6 text-foreground-foreground-normal-lighter">
                  시트를 내리거나 배경을 누르면 시트가 닫혀요.
                </p>
              </div>
            </ModalSheet.Content>
          </ModalSheet.Container>
          <ModalSheet.Backdrop onTap={close} />
        </ModalSheet>
      </div>
    );
  },
};

/** 항목 선택형 (값 선택 후 시트 닫힘) */
export const SelectAccordion: Story = {
  render: () => {
    const { isOpen, open, close, value, select } = usePicker<string>();
    const items = ['행사', '활동', '제휴', '릴리즈', '기타'];
    const sheetId = 'select-sheet';

    return (
      <div>
        <AccordionSelect title={value ?? '행사 종류 선택'} isOpen={isOpen} onClick={open} />

        <ModalSheet
          isOpen={isOpen}
          onClose={close}
          aria-labelledby={sheetId}
          className="flex w-full"
        >
          <ModalSheet.Container>
            <ModalSheet.Header />
            <ModalSheet.Content>
              <div id={sheetId} className="flex flex-col gap-[0.25rem] p-15">
                {items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => select(item)}
                    className={`rounded-md px-5 py-10 text-left transition-colors ${
                      value === item
                        ? 'bg-background-secondary font-semibold'
                        : 'hover:bg-background-secondary'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </ModalSheet.Content>
          </ModalSheet.Container>
          <ModalSheet.Backdrop onTap={close} />
        </ModalSheet>
      </div>
    );
  },
};
