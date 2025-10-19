'use client';

import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
import * as amplitude from '@amplitude/analytics-browser';

export const HomePage = () => {
  const handleTestEvent = () => {
    amplitude.track('TEST_EVENT', {
      page: 'HomePage',
      clickedAt: new Date().toISOString(),
    });
    console.info('[Amplitude] TEST_EVENT 전송 완료');
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
    </div>
  );
};
