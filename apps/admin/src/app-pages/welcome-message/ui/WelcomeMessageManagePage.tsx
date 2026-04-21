'use client';

import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { HeaderMode } from '@surf/ui/header';
import { TextArea } from '@surf/ui/text-area';

import { useState } from 'react';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

const MAIN_MESSAGE_LIMIT = 40;
const SUB_MESSAGE_LIMIT = 10;
const STICKY_FOOTER_SHADOW =
  'shadow-[var(--effect-shadow-embossed-inverse-x-normal,0)_var(--effect-shadow-embossed-inverse-y-normal,0)_var(--effect-shadow-embossed-inverse-blur,2px)_var(--effect-shadow-raised-spread,0)_var(--effect-shadow-embossed-inverse-color-normal,rgba(0,0,0,0.02)),var(--effect-shadow-embossed-inverse-x-normal,0)_var(--effect-shadow-embossed-inverse-y-secondary,-2px)_var(--effect-shadow-embossed-inverse-blur-secondary,4px)_var(--effect-shadow-embossed-inverse-spread,0)_var(--effect-shadow-embossed-inverse-color-secondary,rgba(0,0,0,0.04))]';

export const WelcomeMessageManagePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  // TODO: ADM-MES-01 — useWelcomeMessageQuery()로 조회 후 useEffect에서 setMainMessage/setSubMessage로 초기값 주입
  const [mainMessage, setMainMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');

  const canSubmit = mainMessage.trim().length > 0 && subMessage.trim().length > 0;

  const handleEdit = () => setIsEditMode(true);
  const handleBack = () => setIsEditMode(false);

  // TODO: ADM-MES-02 — isPending을 useUpdateWelcomeMessageMutation()에서 받아 canSubmit 조건에 추가
  const isPending = false;
  const handleSubmit = () => {
    // TODO: ADM-MES-02 — useMutation으로 웰컴 메시지 수정, 성공 시 setIsEditMode(false)
  };

  return (
    <div className="flex h-dvh w-full flex-col">
      <AppHeader
        customBack={isEditMode ? handleBack : undefined}
        overrideHeader={
          isEditMode
            ? {
                mode: HeaderMode.Default,
                title: '웰컴 메시지 관리',
                hasLeftIcon: true,
              }
            : {
                mode: HeaderMode.TextBtn,
                title: '웰컴 메시지 관리',
                hasLeftIcon: true,
                text: '수정',
                btnVariant: 'primary',
                onClickTextBtn: handleEdit,
              }
        }
      />

      <div className="flex flex-1 flex-col gap-[1.125rem] px-[18px] py-[12px]">
        <FieldGroup title="메인 메시지" isRequired={isEditMode}>
          <TextArea
            mode="multiLine"
            value={mainMessage}
            onChange={setMainMessage}
            placeholder="새로운 Tavy들을 환영합니다 !"
            textLimit={isEditMode ? MAIN_MESSAGE_LIMIT : undefined}
            readOnly={!isEditMode}
          />
        </FieldGroup>

        <FieldGroup title="서브 메시지" isRequired={isEditMode}>
          <TextArea
            mode="oneLine"
            value={subMessage}
            onChange={setSubMessage}
            placeholder="16기 운영진 일동"
            textLimit={isEditMode ? SUB_MESSAGE_LIMIT : undefined}
            readOnly={!isEditMode}
          />
        </FieldGroup>
      </div>

      {isEditMode && (
        <div className={`bg-background-normal sticky bottom-0 p-13 ${STICKY_FOOTER_SHADOW}`}>
          <SolidButton
            size="l"
            variant="primary"
            isDisabled={!canSubmit || isPending}
            onClick={handleSubmit}
          >
            수정하기
          </SolidButton>
        </div>
      )}
    </div>
  );
};
