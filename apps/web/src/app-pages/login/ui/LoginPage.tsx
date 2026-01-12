'use client';

import Logo from '../../../../public/logo.svg';
import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';

export const LoginPage = () => {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]">
      <Logo width={163.684} height={55.04} />
      <KakaoLoginButton />
    </div>
  );
};
