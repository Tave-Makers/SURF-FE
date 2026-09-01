'use client';

import { Sheet } from '@surf/ui/sheet';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import type { SocialProvider } from '../api/types';
import { startSocialAccountIntegrationLogin } from '../lib/startSocialAccountIntegrationLogin';
import type { IntegrationTarget } from '../model/types';
import { IntegrationTargetCard } from './IntegrationTargetCard';
import { SocialAccountIntegrationLoginButton } from './SocialAccountIntegrationLoginButton';
import { PAGE_ROUTES } from '@/shared/config/path';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    accountIntegration: Omit<AccountIntegrationBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type AccountIntegrationBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 온보딩 제출 409 응답으로 발급받은 1회성 통합 토큰 */
  integrationToken: string;
  target: IntegrationTarget;
};

export const AccountIntegrationBottomSheet = ({
  isOpen,
  onClose,
  integrationToken,
  target,
}: AccountIntegrationBottomSheetProps) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const visibleProviders = (['KAKAO', 'APPLE'] satisfies SocialProvider[]).filter((provider) =>
    target.providers.includes(provider),
  );

  const handleBackToLogin = () => {
    onClose();
    router.replace(PAGE_ROUTES.LOGIN);
  };

  const handleProviderLogin = (provider: SocialProvider) => {
    setIsRedirecting(true);
    setLoginErrorMessage(null);

    const result = startSocialAccountIntegrationLogin(provider, integrationToken);
    if (!result.ok) {
      setIsRedirecting(false);
      setLoginErrorMessage(
        '로그인 정보를 임시 저장하지 못했어요. 브라우저 설정을 확인한 뒤 다시 시도해주세요.',
      );
      return;
    }

    // 앱의 네이티브 로그인은 이 화면 위에 시트로 뜬다. 취소하면 여기로 그대로 돌아오므로
    // 페이지를 떠나는 리다이렉트와 달리 버튼을 잠가둘 이유가 없다
    if (result.via === 'native') setIsRedirecting(false);
  };

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      disableDrag={true}
      className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
    >
      <ModalSheet.Container>
        <ModalSheet.Content>
          <Sheet
            title="기존 가입 정보가 확인되었습니다."
            description="안전한 데이터 유지를 위해 현재의 로그인을 아래 기존 계정에 연결할까요? 연결 시 기존 활동 점수와 프로필이 그대로 유지됩니다."
            textBtn={{
              label: '로그인 화면으로 돌아가기',
              onClick: handleBackToLogin,
              disabled: isRedirecting,
            }}
          >
            <div className="flex w-full flex-col gap-15 py-15">
              <IntegrationTargetCard target={target} />

              {visibleProviders.length > 0 && (
                <div className="flex w-full flex-col gap-10">
                  {visibleProviders.map((provider) => (
                    <SocialAccountIntegrationLoginButton
                      key={provider}
                      provider={provider}
                      disabled={isRedirecting}
                      onClick={handleProviderLogin}
                    />
                  ))}

                  {loginErrorMessage && (
                    <p
                      role="alert"
                      aria-live="polite"
                      className="text-caption-caption6 text-foreground-danger px-2"
                    >
                      {loginErrorMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={isRedirecting ? undefined : onClose} />
    </ModalSheet>
  );
};
