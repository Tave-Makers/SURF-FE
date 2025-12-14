'use client';

import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { SolidButton } from '@/shared/ui/button/solid-button/SolidButton';
import * as amplitude from '@amplitude/analytics-browser';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/shared/store/toastStore';

const handleToast = () => {
  useToastStore.getState().show('성공');
};

export const HomePage = () => {
  const router = useRouter();

  const handleTestEvent = () => {
    amplitude.track('TEST_EVENT', {
      page: 'HomePage',
      clickedAt: new Date().toISOString(),
    });
    console.info('[Amplitude] TEST_EVENT 전송 완료');
  };

  const handleCalendarClick = () => {
    router.push('/home/calendar');
  };

  return (
    <div>
      <h1 className="text-head-26-700--1 text-background-primary">안녕하세요 hello world</h1>
      <h1 className="text-caption-9-600--4 text-foreground-success">안녕하세요 hello world</h1>
      {/* 기본(stroke) 아이콘 */}
      <SurfIcon
        name="SmileCircle"
        size="m"
        className="cursor-pointer text-[color:var(--color-foreground-success)] hover:text-[color:var(--color-foreground-danger)]"
      />

      {/* Solid 아이콘 */}
      <SurfIcon
        name="SmileCircleSolid"
        size="l"
        className="cursor-pointer text-[color:var(--color-foreground-primary)] hover:text-[color:var(--color-foreground-warning)]"
      />

      <SolidButton size="s" variant="primary" onClick={handleTestEvent}>
        Amplitude 이벤트 테스트
      </SolidButton>

      <button className="bg-amber-300" onClick={handleCalendarClick}>
        캘린더 화면 보기 클릭!
      </button>
      <button onClick={handleToast}>토스트</button>
    </div>
  );
};
