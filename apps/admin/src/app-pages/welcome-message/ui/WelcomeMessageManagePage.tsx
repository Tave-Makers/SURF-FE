'use client';

import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { HeaderMode } from '@surf/ui/header';
import { TextArea } from '@surf/ui/text-area';

import { useWelcomeMessageForm } from '@/features/welcome-message';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

const MAIN_MESSAGE_LIMIT = 40;
const SUB_MESSAGE_LIMIT = 10;

/**
 * 홈 화면 웰컴 메시지(메인 문구·서브 문구)를 조회·수정하는 관리 페이지.
 *
 * - 조회 모드: 헤더 우측 "수정" 버튼으로 편집 진입
 * - 편집 모드: 저장 성공 시 조회 모드로 복귀, 뒤로가기 시 변경 취소(서버 데이터로 재설정)
 * - `message` → 메인 메시지(최대 40자), `sender` → 서브 메시지(최대 10자)
 */
export const WelcomeMessageManagePage = () => {
  const { state, actions } = useWelcomeMessageForm();
  const { isEditMode, mainMessage, subMessage, canSubmit, isPending } = state;
  const { setMainMessage, setSubMessage, handleEdit, handleBack, handleSubmit } = actions;

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
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

      <div className="flex flex-1 flex-col gap-14 px-14 py-11">
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
        <div className={`bg-background-normal shadow-embossed-inverse bottom-0 px-13 pt-13 pb-16`}>
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
