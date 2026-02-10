import Image from 'next/image';
import { BannerActiveBadge } from './BannerActiveBadge';
import DEFAULT_BANNER_IMAGE from '@/shared/assets/images/banner/banner-default-item.png';

interface BannerItemProps {
  imageUrl?: string;
  name: string;
  isActive: boolean;
  isReorderMode: boolean;
  onClick: () => void;
}

export const BannerItem = ({
  imageUrl,
  name,
  isActive,
  isReorderMode,
  onClick,
}: BannerItemProps) => {
  return (
    <button
      className={`flex w-full min-w-0 items-center gap-10 px-14 py-11 text-left ${isReorderMode ? 'pl-0' : ''}`}
      onClick={onClick}
      disabled={isReorderMode}
    >
      {imageUrl ? (
        <Image
          src={imageUrl || DEFAULT_BANNER_IMAGE}
          alt={name}
          width={78}
          height={48}
          className="shrink-0 object-cover"
        />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
        <div className="text-body-body6 text-foreground-normal w-full min-w-0 flex-1 truncate">
          {name}
        </div>

        <BannerActiveBadge isActive={isActive} />
      </div>
    </button>
  );
};
