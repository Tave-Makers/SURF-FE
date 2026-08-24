'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import Logo from '../../../../public/logo.svg';
import { AppleLoginButton } from '@/features/auth/ui/AppleLoginButton';
import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';

import { PAGE_ROUTES } from '@/shared/config/path';

const PUBLIC_POLICY_LINKS = [
  { href: PAGE_ROUTES.PUBLIC_POLICY.SERVICE, label: '서비스 이용약관' },
  { href: PAGE_ROUTES.PUBLIC_POLICY.PRIVACY, label: '개인정보 처리방침' },
  { href: PAGE_ROUTES.PUBLIC_POLICY.OPERATING, label: '운영정책' },
] as const;

export const LoginPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);

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
      return;
    }

    router.replace(PAGE_ROUTES.LOGIN);
    showToast(msg);
  }, [msg, openAlert, closeAlert, router, showToast]);

  return (
    <div className="flex h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]">
      <Logo width={163.684} height={55.04} />
      {/* 임시 처리 <KakaoLoginButton /> */}
      <div className="flex w-full flex-col items-center gap-[1.25rem]">
        <KakaoLoginButton />
        <AppleLoginButton />
        <nav aria-label="서비스 정책" className="flex items-center justify-center gap-x-6">
          {PUBLIC_POLICY_LINKS.map(({ href, label }, index) => (
            <Fragment key={href}>
              {index > 0 && (
                <span aria-hidden="true" className="text-caption-caption4 text-foreground-tertiary">
                  |
                </span>
              )}
              <Link
                href={href}
                className="text-caption-caption4 text-foreground-tertiary underline underline-offset-2"
              >
                {label}
              </Link>
            </Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};
