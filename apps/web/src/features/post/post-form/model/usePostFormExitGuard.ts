'use client';

import { useEffect, useRef } from 'react';

type UsePostFormExitGuardParams = {
  enabled: boolean;
  hasUnsavedChanges: () => boolean;
  /** 저장 안 한 변경사항이 있는 채로 이탈을 시도한 경우 (확인창 노출) */
  onRequestExit: () => void;
  /** 변경사항이 없어 확인창 없이 나가는 경우 (폼 정리용) */
  onSilentExit: () => void;
};

const GUARD_STATE_KEY = '__postFormExitGuard';

const readHistoryState = () => window.history.state as Record<string, unknown> | null;

/** 지금 서 있는 히스토리 엔트리가 뒤로가기 흡수용 더미 엔트리인지 */
const isOnGuardEntry = () => readHistoryState()?.[GUARD_STATE_KEY] === true;

/**
 * 뒤로가기를 흡수할 더미 엔트리를 현재 URL 위에 쌓는다.
 * 기존 state를 함께 펼쳐 넘기는 이유는, App Router가 popstate 때 읽는 내부
 * state(__NA, __PRIVATE_NEXTJS_INTERNALS_TREE)가 빠지면 전체 새로고침으로
 * 빠질 수 있기 때문이다.
 */
const pushGuardEntry = () => {
  window.history.pushState({ ...readHistoryState(), [GUARD_STATE_KEY]: true }, '');
};

/** 코드가 의도적으로 히스토리를 되감는 중인지 (사용자 뒤로가기와 구분) */
let isRewindingHistory = false;

const REWIND_TIMEOUT_MS = 400;

/**
 * 히스토리를 steps만큼 되감고, 되감긴 뒤의 pathname으로 resolve 한다.
 * 되돌아갈 엔트리가 없어 popstate가 오지 않으면 null로 resolve 한다.
 */
const rewindHistory = (steps: number) =>
  new Promise<string | null>((resolve) => {
    if (typeof window === 'undefined' || steps <= 0) {
      resolve(typeof window === 'undefined' ? null : window.location.pathname);
      return;
    }

    isRewindingHistory = true;

    // popstate가 오지 않는 경우(되돌아갈 엔트리 없음 등)에도 이동이 막히지 않도록.
    const fallbackTimer = window.setTimeout(() => settle(null), REWIND_TIMEOUT_MS);

    function settle(pathname: string | null) {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('popstate', handleRewound);
      isRewindingHistory = false;
      resolve(pathname);
    }

    function handleRewound() {
      settle(window.location.pathname);
    }

    window.addEventListener('popstate', handleRewound);
    window.history.go(-steps);
  });

/**
 * 더미 엔트리만 걷어낸다. 저장 후 다른 화면으로 replace 할 때 사용한다.
 * (글쓰기 엔트리는 남겨두고 그 자리를 replace로 덮어써야 스택이 깔끔하다.)
 */
export const leavePostFormGuardEntry = () => rewindHistory(isOnGuardEntry() ? 1 : 0);

/**
 * 글쓰기 페이지가 차지한 엔트리(원본 + 더미)를 통째로 걷어낸다.
 * 확인창에서 "나가기"를 누르거나 변경사항 없이 나갈 때 사용한다.
 */
export const leavePostFormHistory = () => rewindHistory(isOnGuardEntry() ? 2 : 1);

export const usePostFormExitGuard = ({
  enabled,
  hasUnsavedChanges,
  onRequestExit,
  onSilentExit,
}: UsePostFormExitGuardParams) => {
  const formPathnameRef = useRef('');

  useEffect(() => {
    formPathnameRef.current = window.location.pathname;
  }, []);

  // 1. 변경사항이 생기면 뒤로가기를 흡수할 더미 엔트리를 쌓아둔다.
  //    이게 없으면 뒤로가기가 실제로 이전 페이지로 이동해버려서, 확인창을 띄우라는
  //    setState가 반영되기 전에 글쓰기 페이지가 언마운트된다 (= 모달이 안 뜬다).
  //    hasUnsavedChanges는 스토어 값이 바뀔 때마다 새로 만들어지므로, 엔트리가
  //    어떤 이유로 걷혔더라도 다음 입력에서 다시 채워진다.
  useEffect(() => {
    if (!enabled || !hasUnsavedChanges() || isOnGuardEntry()) return;
    pushGuardEntry();
  }, [enabled, hasUnsavedChanges]);

  // 2. 새로고침 / 탭 닫기
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges()) return;

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, hasUnsavedChanges]);

  // 3. 브라우저 뒤로가기 (헤더 뒤로가기는 customBack으로 직접 처리되어 여기 오지 않는다)
  useEffect(() => {
    if (!enabled) return;

    const handlePopState = () => {
      // 코드가 히스토리를 되감는 중이면 사용자의 이탈 시도가 아니다.
      if (isRewindingHistory) return;

      // 더미 엔트리만 pop된 경우엔 URL이 그대로다 = 아직 이 페이지를 떠나지 않았다.
      const stillOnFormPage = window.location.pathname === formPathnameRef.current;

      if (!hasUnsavedChanges()) {
        onSilentExit();
        // 더미 엔트리만 걷힌 상태라면 사용자가 의도한 만큼 실제로 뒤로 보내준다.
        if (stillOnFormPage) window.history.back();
        return;
      }

      if (!stillOnFormPage) {
        // 더미 엔트리가 없어 이미 떠나버린 경우의 안전망. 여기선 확인창을 띄울 수
        // 없으므로 폼 상태만 정리하고 내비게이션은 브라우저에 맡긴다.
        onSilentExit();
        return;
      }

      // 더미 엔트리를 다시 쌓아 이 페이지에 머문 채로 확인창을 띄운다.
      // history.go(1)은 비동기라 라우터 전환과 경합하지만, pushState는 동기라
      // 페이지를 떠나는 일 자체가 발생하지 않는다.
      pushGuardEntry();
      onRequestExit();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enabled, hasUnsavedChanges, onRequestExit, onSilentExit]);
};
