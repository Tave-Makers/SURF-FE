'use client';

import { Carousel } from '@surf/ui/carousel';
import { HeaderMode } from '@surf/ui/header';
import { Shortcut } from '@surf/ui/shortcut';
import { useRouter } from 'next/navigation';
import HeaderLogo from '../../../../public/header-logo.svg';
import { useGetHome } from '@/entities/home/api/useGetHome';
import { TAVE_CHANNEL_LINKS, SPONSOR_LINKS, SHORTCUT_LINKS } from '@/entities/home/model/constants';
import { useGetNotifications } from '@/entities/notification/model/useGetNotifications';
import { AnnouncementBar } from '@/entities/schedule/ui/announcement-bar/AnnouncementBar';
import type { HeroCardProps } from '@/features/home-theme/ui/hero-card/HeroCard';
import { HeroCard } from '@/features/home-theme/ui/hero-card/HeroCard';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const HomePageClient = ({ heroProps }: { heroProps: HeroCardProps }) => {
  const router = useRouter();

  const { data: homeData } = useGetHome();
  const deepLink = homeData?.announcementDeepLink ?? '';

  const { data: notifications } = useGetNotifications('ALL');
  const hasUnread = notifications?.some((noti) => !noti.isRead);

  const handleShortcutClick = (link: string, label: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label} 클릭 - ${link}로 이동`);
    }
    router.push(link);
  };

  return (
    <div className="flex flex-col overflow-y-auto pb-[1.61rem]">
      <div className="absolute z-10 w-full sm:w-[min(100dvw,calc(100dvh*375/812))]">
        {/* AppHeader */}
        <AppHeader
          overrideHeader={{
            mode: HeaderMode.Logo,
            logo: <HeaderLogo role="presentation" aria-label="SURF 홈 로고" />,
            icons: [
              {
                label: 'Bell',
                isNew: hasUnread,
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
        <div className="flex w-full flex-col">
          <HeroCard {...heroProps} />
        </div>

        <div className="flex flex-col gap-16 px-13 pt-15">
          {/* Announcement Bar */}
          <AnnouncementBar
            title={homeData?.announcementTitle ?? '타이틀 제목 없음'}
            date={homeData?.announcementDate ?? '날짜없음'}
            category="official" // 카테고리 데이터 필요 {homeData?.announcementCategory ?? 'official'}
            onClick={() => {
              if (!deepLink) {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('공지사항 링크가 없습니다.');
                }
                return;
              }
              router.push(deepLink);
            }}
          />

          {/* Carousel */}
          <Carousel
            images={
              homeData?.carouselImages?.map((img) => ({
                ...img,
                linkUrl: img.linkUrl === null ? undefined : img.linkUrl,
              })) ?? []
            }
          />

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
            <div className="text-body-body7 text-foreground-normal">TAVE 채널 바로가기</div>
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
            <div className="text-body-body7 text-foreground-normal">후원사 바로가기</div>
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
    </div>
  );
};
