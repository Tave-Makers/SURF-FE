'use client';

import { TrackPart } from '../../model/types';

type ActivityScoreBannerProps = {
  part: TrackPart;
  score: number;
  onClickMore: () => void;
};

const ICON_SRC_MAP: Record<TrackPart, string> = {
  WEB_FRONTEND: '/images/activity-score-banner/frontend-character.svg',
  APP_FRONTEND: '/images/activity-score-banner/frontend-character.svg',
  BACKEND: '/images/activity-score-banner/backend-character.svg',
  DESIGN: '/images/activity-score-banner/design-character.svg',
  DATA_ANALYSIS: '/images/activity-score-banner/data-analysis-character.svg',
  DEEP_LEARNING: '/images/activity-score-banner/deep-learning-character.svg',
};

export const ActivityScoreBanner = ({ part, score, onClickMore }: ActivityScoreBannerProps) => {
  const iconSrc = ICON_SRC_MAP[part];

  return (
    <div className="rounded-4 relative flex h-[8.125rem] w-full flex-col justify-center overflow-hidden opacity-100">
      {/* 메인 배경 */}
      <img
        src="/images/activity-score-banner/background.svg"
        alt=""
        aria-hidden="true"
        className="rounded-4 absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* 아이콘 */}
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute start-0 bottom-0 h-[6.6875rem] w-[6.6875rem] select-none"
      />

      {/* 오버레이 */}
      <div className="rounded-4 bg-background-normal-alpha-accent absolute inset-0" />

      {/* 텍스트 */}
      <div className="text-foreground-static-white relative flex h-full w-full flex-col gap-15 px-12 py-11">
        <div className="text-body-body8 flex w-full flex-row items-center justify-between p-7">
          <span>현재 내 활동점수는?</span>
          <button
            type="button"
            onClick={onClickMore}
            aria-label="활동 점수 더보기"
            className="cursor-pointer"
          >
            더보기
          </button>
        </div>

        <span className="flex h-full w-full items-end justify-end">
          <span className="text-body-body1">{score}</span>
        </span>
      </div>
    </div>
  );
};
