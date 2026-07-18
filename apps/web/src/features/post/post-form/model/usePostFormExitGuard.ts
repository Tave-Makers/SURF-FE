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
      history.go(1);
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
