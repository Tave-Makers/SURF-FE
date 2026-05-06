'use client';

import Image from 'next/image';

type BadgeListItemProps = {
  badgeId: number;
  imageUrl: string;
  name: string;
  onClick: () => void;
};

export const BadgeListItem = ({ imageUrl, name, onClick }: BadgeListItemProps) => {
  return (
    <button
      type="button"
      className="border-border-normal flex w-full items-center gap-10 border-b px-14 py-11 text-left"
      onClick={onClick}
    >
      <div className="rounded-3 relative h-[3rem] w-[4.875rem]">
        <Image src={imageUrl} alt={name} fill className="shrink-0 object-cover" />
      </div>

      <span className="text-body-body6 text-foreground-static-black min-w-0 flex-1 truncate">
        {name}
      </span>
    </button>
  );
};
