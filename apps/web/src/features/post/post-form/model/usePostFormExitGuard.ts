'use client';

import { useEffect, useRef } from 'react';

type UsePostFormExitGuardParams = {
  enabled: boolean;
  hasUnsavedChanges: () => boolean;
  onRequestExit: () => void;
};

export const usePostFormExitGuard = ({
  enabled,
  hasUnsavedChanges,
  onRequestExit,
}: UsePostFormExitGuardParams) => {
  const hasPushedExitGuardStateRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    if (!hasPushedExitGuardStateRef.current) {
      hasPushedExitGuardStateRef.current = true;
      history.pushState({ __postFormExitGuard: true }, '', window.location.href);
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges()) return;

      event.preventDefault();
      event.returnValue = '';
    };

    const handlePopState = () => {
      // 저장 안 한 변경사항이 있을 때만 뒤로가기를 취소하고 확인창을 띄운다.
      // 없으면 go(1)을 호출하지 않는다 — onRequestExit()이 부르는 router.replace()가
      // 아직 끝나지 않은 go(1)과 경합하면, replace로 이동한 직후 go(1)이 뒤늦게
      // 실행되며 가드 엔트리로 다시 스냅해버린다 (뒤로가기 무한루프의 원인).
      if (hasUnsavedChanges()) {
        history.go(1);
      }
      onRequestExit();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enabled, hasUnsavedChanges, onRequestExit]);
};
