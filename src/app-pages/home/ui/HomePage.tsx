'use client';

import { useGetHome } from '@/entities/home/api/useGetHome';
import { AnnouncementBar } from '@/entities/schedule/ui/announcement-bar/AnnouncementBar';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Shortcut } from '@/shared/ui/shortcut/Shortcut';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { useState } from 'react';
import { TAVE_CHANNEL_LINKS, SPONSOR_LINKS, SHORTCUT_LINKS } from '@/entities/home/model/constants';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';

export const HomePage = () => {
  const router = useRouter();
  const { agreements, handleCheck, isAllRequiredChecked, onClickLawDetail } = useLawAgreement();
  const [isOpen, setIsOpen] = useState(!agreements.laws1 || !agreements.laws2 || !agreements.laws3);

  const { data: homeData } = useGetHome();
  const deepLink = homeData?.announcementDeepLink ?? '';

  const handleShortcutClick = (link: string, label: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label} 클릭 - ${link}로 이동`);
    }
    router.push(link);
  };

  return (
    <div className="overflow-y-auto pb-[1.61rem]">
      <div className="absolute z-10 w-full sm:w-[360px]">
        {/* AppHeader */}
        <AppHeader
          overrideHeader={{
            mode: HeaderMode.Logo,
            logo: <div>Custom Logo</div>,
            icons: [
              {
                label: 'Bell',
                onClickIcon: () => {
                  router.push(PAGE_ROUTES.NOTIFICATION);
                },
              },
            ],
          }}
          className="bg-transparent"
        />
      </div>

      <div>
        {/* Hero Card */}
        <div className="bg-foreground-badge-pink h-85 w-full">
          {/* <HeroCard
            userData={{
              name: homeData?.userName,
              batch: homeData?.userBatch,
              part: homeData?.userPart,
            }}
            noticeData={{
              title: homeData?.noticeDataMainText,
              // sender: homeData?.noticeDataSender,
            }}
            imgData={[]} // 프론트엔드에서 결정할 부분
          /> */}
        </div>

        <div className="flex flex-col gap-16 px-13 pt-15">
          {/* Announcement Bar */}
          <AnnouncementBar
            title={homeData?.announcementTitle ?? '타이틀 제목 없음'}
            date={homeData?.announcementDate ?? '날짜없음'}
            category="official" // 카테고리 데이터 필요 {homeData?.announcementCategory ?? 'official'}
            onClick={() => {
              router.push(deepLink);
            }}
          />

          {/* Carousel */}
          <Carousel images={homeData?.carouselImages ?? []} />

          {/* 앱 내 바로가기 링크 */}
          {/* 기획 측 정리 문서 필요 */}
          <div className="flex flex-row gap-11">
            <div className="flex w-full gap-11">
              {SHORTCUT_LINKS.map((link) => (
                <Shortcut
                  key={link.id}
                  type="rectangle"
                  label={link.label}
                  imageSrc={link.imageSrc}
                  onClick={() => handleShortcutClick(link.link, link.label)}
                />
              ))}
            </div>
          </div>

          {/* 테이브 채널 바로가기 */}
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

          {/* 후원사 바로가기 */}
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

      {/* 약관 바텀 시트 */}
      {isAllRequiredChecked ? null : (
        <LawBottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          agreements={agreements}
          onCheck={handleCheck}
          onClickPrimaryBtn={() => {
            if (isAllRequiredChecked) {
              setIsOpen(false);
            } else {
              alert('필수 약관에 모두 동의해 주세요.');
            }
          }}
          onClickLawDetail={onClickLawDetail}
          allAgreed={isAllRequiredChecked}
        />
      )}
    </div>
  );
};
