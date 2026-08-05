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
    startSocialAccountIntegrationLogin(provider, integrationToken);
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
