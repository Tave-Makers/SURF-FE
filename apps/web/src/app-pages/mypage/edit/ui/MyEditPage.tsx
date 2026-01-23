'use client';

import { HeaderMode } from '@surf/ui/header';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { UserProfile } from '@/entities/user/model/types';
import {
  EditProfileForm,
  type EditProfileFormHandle,
} from '@/features/profile/edit-profile/ui/EditProfileForm';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

interface Props {
  initialProfile: UserProfile;
}

export const MyEditPage = ({ initialProfile }: Props) => {
  const formRef = useRef<EditProfileFormHandle>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const hasPushedStateRef = useRef(false);
  const isDirtyRef = useRef(false);
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const openExitAlert = useCallback(
    (onConfirm: () => void) => {
      openAlert({
        state: 'default',
        title: '정말 나가시겠습니까?',
        infoText: '현재 페이지에서 이탈하면 변경된 정보가 저장되지 않아요.',
        actions: [
          { type: 'solid', label: '취소', variant: 'secondary', onClick: closeAlert },
          {
            type: 'solid',
            label: '나가기',
            variant: 'primary',
            onClick: () => {
              closeAlert();
              onConfirm();
            },
          },
        ],
      });
    },
    [closeAlert, openAlert],
  );

  const navigateToMyPage = useCallback(() => {
    router.push(PAGE_ROUTES.MYPAGE.MAIN);
  }, [router]);

  const handleBack = () => {
    if (!isDirty) {
      navigateToMyPage();
      return;
    }

    openExitAlert(navigateToMyPage);
  };

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    if (!hasPushedStateRef.current) {
      hasPushedStateRef.current = true;
      history.pushState({ __exitGuard: true }, '', window.location.href);
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };

    const handlePopState = () => {
      history.go(1);
      if (!isDirtyRef.current) {
        navigateToMyPage();
        return;
      }
      openExitAlert(navigateToMyPage);
    };

    const handleClick = (event: MouseEvent) => {
      if (!isDirtyRef.current) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const linkTarget = anchor.getAttribute('target');
      event.preventDefault();
      openExitAlert(() => {
        if (linkTarget === '_blank') {
          window.open(href, '_blank', 'noopener,noreferrer');
          return;
        }
        if (href.startsWith('http')) {
          window.location.assign(href);
          return;
        }
        router.push(href);
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick, true);
    };
  }, [navigateToMyPage, openExitAlert, router]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <AppHeader
        customBack={handleBack}
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: '프로필 수정',
          hasLeftIcon: true,
          text: '저장',
          btnVariant: 'secondary',
          isDisabled: !canSubmit,
          onClickTextBtn: () => formRef.current?.submit(),
        }}
      />

      <EditProfileForm
        ref={formRef}
        initialProfile={initialProfile}
        onCanSubmitChange={setCanSubmit}
        onDirtyChange={setIsDirty}
      />
    </div>
  );
};
