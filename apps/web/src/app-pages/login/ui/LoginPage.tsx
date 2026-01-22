'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Logo from '../../../../public/logo.svg';
import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';

export const LoginPage = () => {
  const searchParams = useSearchParams();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const alertOpenedRef = useRef(false);

  const msg = searchParams.get('msg');

  useEffect(() => {
    if (!msg) return;
    if (alertOpenedRef.current) return;

    if (msg === 'pending') {
      alertOpenedRef.current = true;
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

    if (msg === 'rejected') {
      alertOpenedRef.current = true;
      openAlert({
        state: 'default',
        title: '회원가입이 거절됐어요.',
        infoText: '다시 회원가입을 원하시면 tavemakers@gmail.com으로 연락주세요.',
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
  }, [msg, openAlert, closeAlert]);

  return (
    <div className="flex h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]">
      <Logo width={163.684} height={55.04} />
      <KakaoLoginButton />
    </div>
  );
};
