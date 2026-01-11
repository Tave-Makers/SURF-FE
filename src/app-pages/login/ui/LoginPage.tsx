'use client';

import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';
import Logo from '../../../../public/logo.svg';
import { useAlertStore } from '@/shared/store/alertStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useEffect } from 'react';

export function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const msg = searchParams.get('msg');

  useEffect(() => {
    if (!msg) return;

    if (msg === 'pending') {
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
              router.replace(PAGE_ROUTES.LOGIN);
            },
          },
        ],
      });
    }
  }, [msg, openAlert, closeAlert, router]);

  return (
    <div className="flex h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]">
      <Logo width={163.684} height={55.04} />
      <KakaoLoginButton />
    </div>
  );
}
