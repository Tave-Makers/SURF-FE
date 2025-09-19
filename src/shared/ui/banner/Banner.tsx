import BgCommon from '@/shared/assets/icons/banner/banner-background.svg';
import FrontendIcon from '@/shared/assets/icons/banner/banner-frontend.svg';
import BackendIcon from '@/shared/assets/icons/banner/banner-backend.svg';
import DesignIcon from '@/shared/assets/icons/banner/banner-design.svg';
import DataIcon from '@/shared/assets/icons/banner/banner-data-analysis.svg';
import DeepLearningIcon from '@/shared/assets/icons/banner/banner-deep-learning.svg';

type BannerProps = {
  part: 'frontend' | 'backend' | 'design' | 'data-analysis' | 'deep-learning';
  score: number;
  onClickMore: () => void;
};

export const Banner = ({ part, score, onClickMore }: BannerProps) => {
  const iconMap: Record<BannerProps['part'], React.FC<React.SVGProps<SVGSVGElement>>> = {
    frontend: FrontendIcon,
    backend: BackendIcon,
    design: DesignIcon,
    'data-analysis': DataIcon,
    'deep-learning': DeepLearningIcon,
  };

  const IconComponent = iconMap[part];

  return (
    <div className="relative flex h-[8.12rem] w-full flex-col justify-center rounded-[0.5rem] px-[0.87rem] py-[0.75rem]">
      {/* 1. 메인 배경 */}
      <BgCommon className="absolute inset-0 h-full w-full object-cover" />
      {/* 2. 캐릭터 아이콘 (제2의 배경) */}
      {IconComponent && (
        <IconComponent className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none" />
      )}
      <div className="absolute inset-0 rounded-[0.5rem] bg-black/40" />

      {/* 3. 텍스트/UI */}
      <div className="text-foreground-accent z-10 flex flex-col gap-[1.25rem]">
        <div className="text-body-14-600--1-20 flex items-center justify-between">
          <span>현재 내 활동점수는?</span>
          <button onClick={onClickMore} className="z-10 cursor-pointer">
            더보기
          </button>
        </div>
        <span className="text-head-48-700--2 flex items-end justify-end gap-[0.25rem]">
          <span>{score}</span>
          <span className="text-head-26-700--1">점</span>
        </span>
      </div>
    </div>
  );
};
