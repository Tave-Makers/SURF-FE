'use client';

import Apple from '../../../../public/images/apple.svg';
import Kakao from '../../../../public/images/kakao.svg';
import type { SocialProvider } from '../api/types';

type SocialAccountIntegrationLoginButtonProps = {
  provider: SocialProvider;
  disabled?: boolean;
  onClick: (provider: SocialProvider) => void;
};

const PROVIDER_LABEL_MAP: Record<SocialProvider, string> = {
  KAKAO: '카카오',
  APPLE: '애플',
};

export const SocialAccountIntegrationLoginButton = ({
  provider,
  disabled = false,
  onClick,
}: SocialAccountIntegrationLoginButtonProps) => {
  const isKakao = provider === 'KAKAO';
  const Icon = isKakao ? Kakao : Apple;

  const className = [
    'rounded-4 flex h-[3rem] w-full cursor-pointer items-center justify-center gap-[0.5rem]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    isKakao
      ? 'bg-[#FEE500] text-foreground-static-black hover:bg-[#FADA0A]'
      : 'bg-background-normal-inverse text-foreground-normal-reverse hover:bg-[#1F2128]',
  ].join(' ');

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={() => onClick(provider)}
    >
      <Icon width={24} height={24} className={isKakao ? undefined : 'shrink-0'} />
      <span
        className={isKakao ? 'text-foreground-static-black text-title-title2' : 'text-title-title2'}
      >
        {PROVIDER_LABEL_MAP[provider]}로 로그인해서 연동하기
      </span>
    </button>
  );
};
