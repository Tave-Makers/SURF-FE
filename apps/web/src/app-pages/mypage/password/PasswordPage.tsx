'use client';

import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextArea } from '@surf/ui/text-area';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateManagerPassword } from '@/entities/user/api/updateManagerPassword';
import { PAGE_ROUTES } from '@/shared/config/path';

export const PasswordPage = () => {
  const router = useRouter();
  const showToast = useToastStore((state) => state.show);
  const [pw, setPw] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!pw.trim()) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    updateManagerPassword(pw)
      .then(() => {
        setPw('');
        setErrorMessage(null);
        router.replace(PAGE_ROUTES.MYPAGE.MAIN);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : '비밀번호 설정에 실패했습니다.';
        showToast(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col px-13 py-18">
        <FieldGroup title="비밀번호 설정하기" isRequired={true}>
          <TextArea
            mode="multiLine"
            value={pw}
            onChange={setPw}
            errorMessage={errorMessage ?? undefined}
          />
        </FieldGroup>
      </div>
      <div className="mt-auto flex flex-col px-13 pt-13 pb-15">
        <SolidButton
          size="l"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          isDisabled={isSubmitting || !pw.trim()}
        >
          완료
        </SolidButton>
      </div>
    </div>
  );
};
