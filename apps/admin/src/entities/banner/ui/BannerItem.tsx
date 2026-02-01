import { SurfIcon } from '@surf/ui/icon';
import Image from 'next/image';
import { BannerActiveBadge } from './BannerActiveBadge';
import DEFAULT_BANNER_IMAGE from '@/shared/assets/images/banner/banner-default-item.png';
interface BannerItemProps {
  id: number;
  imageUrl?: string;
  name: string;
  isActive: boolean;
  onClickMore: (id: number) => void;
}

export const BannerItem = ({ id, imageUrl, name, isActive, onClickMore }: BannerItemProps) => {
  return (
    <div className="border-border-normal flex w-full min-w-0 items-center gap-10 border-b px-14 py-11">
      <Image src={imageUrl || DEFAULT_BANNER_IMAGE} alt={name} className="shrink-0 object-cover" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
        <div className="flex w-full min-w-0 items-center gap-[2.9375rem]">
          <div className="text-body-body6 text-foreground-normal flex-1 truncate">{name}</div>
          <button
            type="button"
            onClick={() => onClickMore(id)}
            aria-label="더보기"
            className="ml-auto flex shrink-0 justify-center"
          >
            <SurfIcon name="DotsVertical" />
          </button>
        </div>
        <BannerActiveBadge isActive={isActive} />
      </div>
    </div>
  );
};
