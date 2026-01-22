'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '../../../../public/logo.svg';
import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';

import { PAGE_ROUTES } from '@/shared/config/path';

export const LoginPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const msg = searchParams.get('msg');

  useEffect(() => {
    if (!msg) return;

    if (msg === 'pending') {
      router.replace(PAGE_ROUTES.LOGIN);
      openAlert({
        state: 'default',
        title: '회원가입 대기중이에요!',
        infoText: '회원 승인 절차가 완료되면 정상적으로 SURF를 이용하실 수 있습니다.',
        actions: [
          {
            type: 'text',
            variant: 'primary',
            label: '확인',
            onClick: () => {
              closeAlert();
            },
          },
        ],
      });
    }
  }, [msg, openAlert, closeAlert, router]);

  function handleTestPage() {
    router.push('/login/test');
  }

  return (
    <div className="flex h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]">
      <Logo width={163.684} height={55.04} />
      {/* <KakaoLoginButton /> */}
      <div className="flex w-full flex-col items-center gap-[1.25rem]">
        <KakaoLoginButton />

        <button
          type="button"
          className="m-0 cursor-pointer border-none bg-transparent p-0 underline"
          onClick={handleTestPage}
        >
          이메일로 체험하기
        </button>
      </div>
    </div>
  );
};
