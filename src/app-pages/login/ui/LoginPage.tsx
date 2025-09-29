'use client';
import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';

export function LoginPage() {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center px-[1rem]">
        <KakaoLoginButton />
      </div>
    </>
  );
}
