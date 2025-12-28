'use client';
import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';
import Logo from '../../../../public/logo.svg';

export function LoginPage() {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]">
      <Logo width={163.684} height={55.04} />
      <KakaoLoginButton />
    </div>
  );
}
