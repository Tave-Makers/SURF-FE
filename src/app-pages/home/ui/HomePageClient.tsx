'use client';

import { useState } from 'react';
import { useGetHome } from '@/entities/home/api/useGetHome';
import { AnnouncementBar } from '@/entities/schedule/ui/announcement-bar/AnnouncementBar';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Shortcut } from '@/shared/ui/shortcut/Shortcut';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { TAVE_CHANNEL_LINKS, SPONSOR_LINKS } from '@/entities/home/model/constants';
import { HeroCard } from '@/features/home-theme/ui/hero-card/HeroCard';
import type { HeroCardProps } from '@/features/home-theme/ui/hero-card/HeroCard';

export function HomePageClient({ heroProps }: { heroProps: HeroCardProps }) {
  const { agreements, handleCheck, isAllRequiredChecked, onClickLawDetail } = useLawAgreement();
  const [isOpen, setIsOpen] = useState(!agreements.laws1 || !agreements.laws2 || !agreements.laws3);

  // 필요하면 Query로 홈 데이터도 계속 받아서 (배너/공지 등) 렌더
  const { data: homeData } = useGetHome();

  const handleShortcutClick = (link: string, label: string) => {
    console.log(`${label} 클릭 - ${link}로 이동`);
  };

  return (
    <div className="flex flex-col overflow-y-auto pb-[1.61rem]">
      <div className="absolute z-10 w-full sm:w-[360px]">
        <AppHeader
          overrideHeader={{
            mode: HeaderMode.Logo,
            logo: <div>Custom Logo</div>,
            icons: [{ label: 'Bell', onClickIcon: () => console.log('알림 창으로 이동') }],
          }}
          className="bg-transparent"
        />
      </div>

      <div>
        <div className="flex w-full flex-col">
          <HeroCard {...heroProps} />
        </div>

        <div className="flex flex-col gap-16 px-13 pt-15">
          <AnnouncementBar
            title={homeData?.announcementTitle ?? '타이틀 제목 없음'}
            date={homeData?.announcementDate ?? '날짜없음'}
            category="official"
            onClick={() => console.log('공지사항 클릭')}
          />

          <Carousel
            images={(homeData?.carouselImages ?? []).map(({ src, alt, linkUrl }) => ({
              src,
              alt,
              linkUrl: linkUrl ?? undefined,
            }))}
          />

          <div className="flex flex-row gap-11">
            <Shortcut
              type="rectangle"
              label="바로가기 1"
              imageSrc="/path/to/image1.png"
              onClick={() => console.log('바로가기 1 클릭')}
            />
            <Shortcut
              type="rectangle"
              label="바로가기 2"
              imageSrc="/path/to/image2.png"
              onClick={() => console.log('바로가기 2 클릭')}
            />
            <Shortcut
              type="rectangle"
              label="바로가기 3"
              imageSrc="/path/to/image3.png"
              onClick={() => console.log('바로가기 3 클릭')}
            />
          </div>

          <div className="flex flex-col gap-11">
            <div className="text-body-body7 text-black">TAVE 채널 바로가기</div>
            <div className="flex w-full flex-row gap-11">
              {TAVE_CHANNEL_LINKS.map((channel) => (
                <Shortcut
                  key={channel.id}
                  type="circle"
                  label={channel.label}
                  imageSrc={channel.imageSrc}
                  onClick={() => handleShortcutClick(channel.link, channel.label)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-11">
            <div className="text-body-body7 text-black">후원사 바로가기</div>
            <div className="grid grid-cols-4 gap-11">
              {SPONSOR_LINKS.map((sponsor) => (
                <Shortcut
                  key={sponsor.id}
                  type="circle"
                  label={sponsor.label}
                  imageSrc={sponsor.imageSrc}
                  onClick={() => handleShortcutClick(sponsor.link, sponsor.label)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAllRequiredChecked ? null : (
        <LawBottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          agreements={agreements}
          onCheck={handleCheck}
          onClickPrimaryBtn={() => {
            if (isAllRequiredChecked) setIsOpen(false);
            else alert('필수 약관에 모두 동의해 주세요.');
          }}
          onClickLawDetail={onClickLawDetail}
          allAgreed={isAllRequiredChecked}
        />
      )}
    </div>
  );
}
