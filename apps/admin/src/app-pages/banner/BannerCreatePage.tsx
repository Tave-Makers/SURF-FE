'use client';

import { useKeyboardOffset } from '@surf/hooks';
import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextArea } from '@surf/ui/text-area';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { PAGE_ROUTES } from '@/shared/config/path';

interface BannerCreateForm {
  imageUrl: string;
  name: string;
  linkUrl: string;
}

const INITIAL_FORM: BannerCreateForm = {
  imageUrl: '',
  name: '',
  linkUrl: '',
};

export const BannerCreatePage = () => {
  const router = useRouter();
  const keyboardOffset = useKeyboardOffset();

  const [form, setForm] = useState<BannerCreateForm>(INITIAL_FORM);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = useCallback(
    <K extends keyof BannerCreateForm>(key: K, value: BannerCreateForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );
  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.linkUrl.trim().length > 0 &&
      form.imageUrl.trim().length > 0
    );
  }, [form]);

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((state) => state.show);

  const handleOpenSaveAlert = () => {
    openAlert({
      state: 'default',
      title: '저장하시겠습니까?',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'primary',
          label: '저장하기',

          onClick: () => {
            closeAlert();
            // TODO: 저장 로직 추가
            router.replace(PAGE_ROUTES.BANNER.LIST);
            showToast('배너가 생성되었습니다.');
          },
          //    onClick: async () => {
          // if (isSubmitting) return;
          // setIsSubmitting(true);
          // try {
          //   closeAlert();
          //   // TODO: 저장 로직 추가
          //   router.replace(PAGE_ROUTES.BANNER.LIST);
          //   showToast('배너가 생성되었습니다.');
          // } finally {
          //   setIsSubmitting(false);
          // }
          // },
        },
      ],
    });
  };

  return (
    <div className="border-border-normal flex min-h-screen flex-col border-t-[0.4px] pt-11">
      {/* 배너 생성 폼 필드 */}
      <div className="flex flex-1 flex-col gap-[1.125rem] px-14">
        <FieldGroup title="배너 이미지 등록" isRequired>
          <button
            className="rounded-3 border-border-quaternary bg-background-quaternary text-foreground-quinary-darker text-caption-caption3 flex h-[9.375rem] w-full items-center justify-center border border-dashed"
            onClick={() => {}}
            type="button"
          >
            클릭하여 신규 이미지를 업로드 해주세요
          </button>
        </FieldGroup>
        <FieldGroup title="배너 이름" isRequired>
          <TextArea
            placeholder="배너 이름을 입력해주세요."
            value={form.name}
            onChange={(value) => setField('name', value)}
          />
        </FieldGroup>
        <FieldGroup title="URL" isRequired>
          <TextArea
            placeholder="배너 링크 URL을 입력해주세요."
            value={form.linkUrl}
            onChange={(value) => setField('linkUrl', value)}
          />
        </FieldGroup>
      </div>
      {/* 저장 버튼 */}
      <div
        className="sticky bottom-0 p-13 shadow-[var(--effect-shadow-embossed-inverse-x-normal,0)_var(--effect-shadow-embossed-inverse-y-normal,0)_var(--effect-shadow-embossed-inverse-blur,2px)_var(--effect-shadow-raised-spread,0)_var(--effect-shadow-embossed-inverse-color-normal,rgba(0,0,0,0.02)),_var(--effect-shadow-embossed-inverse-x-normal,0)_var(--effect-shadow-embossed-inverse-y-secondary,-2px)_var(--effect-shadow-embossed-inverse-blur-secondary,4px)_var(--effect-shadow-embossed-inverse-spread,0)_var(--effect-shadow-embossed-inverse-color-secondary,rgba(0,0,0,0.04))]"
        style={{ paddingBottom: keyboardOffset + 16 }}
      >
        <SolidButton
          size="l"
          variant="primary"
          onClick={handleOpenSaveAlert}
          isDisabled={!canSubmit}
        >
          저장하기
        </SolidButton>
      </div>
    </div>
  );
};
