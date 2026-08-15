'use client';

import { useKeyboardOffset } from '@surf/hooks';
import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { TextArea } from '@surf/ui/text-area';
import { useBadgeCreateForm } from '@/features/badge/model/useBadgeCreateForm';
import { ImgUploader } from '@/features/image/ui/ImgUploader';

export const BadgeCreatePage = () => {
  const keyboardOffset = useKeyboardOffset();
  const { state, actions } = useBadgeCreateForm();

  return (
    <div className="border-border-normal bg-background-normal flex h-full min-h-0 flex-col border-t-[0.4px]">
      <div className="flex flex-1 flex-col gap-18 px-13 py-11">
        <FieldGroup title="배지 이미지 등록">
          <ImgUploader
            mode="create"
            onSelectFile={actions.setBadgeFile}
            isDisabled={state.isSubmitting}
            emptyText="클릭하여 신규 이미지를 업로드 해주세요"
            buttonClassName="h-[5rem]"
            imageAlt="배지 이미지"
          />
        </FieldGroup>

        <FieldGroup title="배지 이름" isRequired>
          <TextArea
            mode="oneLine"
            value={state.badgeName}
            onChange={actions.setBadgeName}
            placeholder="새로운 17기 환영"
            isDisabled={state.isSubmitting}
          />
        </FieldGroup>
      </div>

      <div
        className="bg-background-normal shadow-embossed-inverse sticky bottom-0 px-13 pt-13"
        style={{
          paddingBottom: `calc(max(env(safe-area-inset-bottom), ${keyboardOffset}px) + 16px)`,
        }}
      >
        <SolidButton
          size="l"
          variant="primary"
          isDisabled={!state.canSubmit || state.isSubmitting}
          onClick={() => void actions.handleSubmit()}
        >
          저장하기
        </SolidButton>
      </div>
    </div>
  );
};
