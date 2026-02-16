'use client';

import { useKeyboardOffset } from '@surf/hooks';
import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { TextArea } from '@surf/ui/text-area';
import { Toggle } from '@surf/ui/toggle';
import { useCallback } from 'react';
import { ImgUploader } from '@/features/image/ui/ImgUploader';

export interface BannerFormData {
  imageUrl: string;
  name: string;
  linkUrl: string;
  isActive: boolean;
}

interface BannerFormWidgetProps {
  mode: 'create' | 'edit';
  data: BannerFormData;
  onChange: (data: BannerFormData) => void;
  onSelectFile: (file: File | null) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  submitLabel: string;
}

export const BannerFormWidget = ({
  mode,
  data,
  onChange,
  onSelectFile,
  onSubmit,
  onDelete,
  isSubmitting,
  canSubmit,
  submitLabel,
}: BannerFormWidgetProps) => {
  const keyboardOffset = useKeyboardOffset();

  const setField = useCallback(
    <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => {
      onChange({ ...data, [key]: value });
    },
    [data, onChange],
  );

  return (
    <div className="border-border-normal flex min-h-screen flex-col border-t-[0.4px] pt-11">
      <div className="flex flex-1 flex-col gap-[1.125rem] px-14 pb-40">
        {/* 수정 모드: 활성화 토글 */}
        {mode === 'edit' && (
          <div className="flex items-center justify-between">
            <FieldGroup title="배너 활성화" isRequired>
              <></>
            </FieldGroup>
            <Toggle
              isChecked={data.isActive ?? false}
              onChange={(checked) => setField('isActive', checked)}
            />
          </div>
        )}

        <FieldGroup title="배너 이미지 등록" isRequired>
          <ImgUploader
            mode={mode}
            value={data.imageUrl}
            emptyText="클릭하여 신규 이미지를 업로드 해주세요"
            overlayText="해당 이미지 클릭 시, 이미지 변경이 가능합니다"
            onSelectFile={onSelectFile}
            isDisabled={isSubmitting}
          />
        </FieldGroup>

        <FieldGroup title="배너 이름" isRequired>
          <TextArea
            placeholder="배너 이름을 입력해주세요."
            value={data.name}
            onChange={(v) => setField('name', v)}
          />
        </FieldGroup>

        <FieldGroup title="URL" isRequired>
          <TextArea
            placeholder="배너 링크 URL을 입력해주세요."
            value={data.linkUrl}
            onChange={(v) => setField('linkUrl', v)}
          />
        </FieldGroup>

        {/* 수정 모드: 삭제 버튼 */}
        {mode === 'edit' && onDelete && (
          <SolidButton size="m" variant="warning" className="mt-20" onClick={onDelete}>
            해당 배너 삭제하기
          </SolidButton>
        )}
      </div>

      {/* 하단 고정 버튼*/}
      <div
        className="sticky bottom-0 p-13 shadow-[var(--effect-shadow-embossed-inverse-x-normal,0)_var(--effect-shadow-embossed-inverse-y-normal,0)_var(--effect-shadow-embossed-inverse-blur,2px)_var(--effect-shadow-raised-spread,0)_var(--effect-shadow-embossed-inverse-color-normal,rgba(0,0,0,0.02)),_var(--effect-shadow-embossed-inverse-x-normal,0)_var(--effect-shadow-embossed-inverse-y-secondary,-2px)_var(--effect-shadow-embossed-inverse-blur-secondary,4px)_var(--effect-shadow-embossed-inverse-spread,0)_var(--effect-shadow-embossed-inverse-color-secondary,rgba(0,0,0,0.04))]"
        style={{ paddingBottom: keyboardOffset + 16 }}
      >
        <SolidButton
          size="l"
          variant="primary"
          onClick={onSubmit}
          isDisabled={!canSubmit || isSubmitting}
        >
          {submitLabel}
        </SolidButton>
      </div>
    </div>
  );
};
