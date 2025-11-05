'use client';

import { FC, SVGProps } from 'react';
import FrontendIcon from '@/shared/assets/icons/banner/banner-frontend.svg';
import BackendIcon from '@/shared/assets/icons/banner/banner-backend.svg';
import DesignIcon from '@/shared/assets/icons/banner/banner-design.svg';
import DataIcon from '@/shared/assets/icons/banner/banner-data-analysis.svg';
import DeepLearningIcon from '@/shared/assets/icons/banner/banner-deep-learning.svg';

type ActivityScoreBannerProps = {
  part: 'frontend' | 'backend' | 'design' | 'data-analysis' | 'deep-learning';
  score: number;
  onClickMore: () => void;
};

export const ActivityScoreBanner = ({ part, score, onClickMore }: ActivityScoreBannerProps) => {
  const iconMap: Record<ActivityScoreBannerProps['part'], FC<SVGProps<SVGSVGElement>>> = {
    frontend: FrontendIcon,
    backend: BackendIcon,
    design: DesignIcon,
    'data-analysis': DataIcon,
    'deep-learning': DeepLearningIcon,
  };

  const IconComponent = iconMap[part];

  return (
    <div className="rounded-4 relative flex h-[8.125rem] w-full flex-col justify-center px-12 py-11 opacity-100">
      {/* 1. 메인 배경 */}
      <img
        src="/icons/banner/banner-background.svg"
        alt=""
        aria-hidden="true"
        className="rounded-4 absolute inset-0 h-full w-full object-cover"
      />
      {/* 2. 캐릭터 아이콘 (제2의 배경) */}
      {IconComponent && (
        <IconComponent
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
        />
      )}
      <div className="rounded-4 bg-background-background-normal-alpha-accent absolute inset-0 flex h-full w-full flex-col" />

      {/* 3. 텍스트/UI */}
      <div className="text-foreground-foreground-accent z-10 flex h-full w-full flex-col gap-15">
        <div className="text-body-body7 flex w-full flex-row items-center justify-between p-7">
          <span>현재 내 활동점수는?</span>
          <button
            type="button"
            onClick={onClickMore}
            aria-label="활동 점수 더보기"
            className="z-10 cursor-pointer"
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
