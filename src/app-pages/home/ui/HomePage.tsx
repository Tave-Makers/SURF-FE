'use client';

import { useGetHome } from '@/entities/home/api/useGetHome';
import { AnnouncementBar } from '@/entities/schedule/ui/announcement-bar/AnnouncementBar';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Shortcut } from '@/shared/ui/shortcut/Shortcut';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const HomePage = () => {
  const { data: homeData } = useGetHome();

  return (
    <div className="overflow-y-auto pb-20">
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
                  console.log('알림 창으로 이동');
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
            title={homeData?.announcementTitle ?? '공지사항'}
            date={homeData?.announcementDate ?? ''}
            category="official" // 카테고리 데이터 필요 {homeData?.announcementCategory ?? 'official'}
            onClick={() => {
              console.log('공지사항 클릭');
              // router.push(deepLink)
            }}
          />

          {/* Carousel */}
          <Carousel images={homeData?.carouselImages ?? []} />

          {/* Shortcut Buttons */}
          {/* 기획 측 정리 문서 필요 */}
          <div className="flex flex-row gap-11">
            <Shortcut
              type="rectangle"
              label="바로가기 1"
              imageSrc="/path/to/image1.png"
              onClick={() => {
                console.log('바로가기 1 클릭');
              }}
            />
            <Shortcut
              type="rectangle"
              label="바로가기 2"
              imageSrc="/path/to/image2.png"
              onClick={() => {
                console.log('바로가기 2 클릭');
              }}
            />
            <Shortcut
              type="rectangle"
              label="바로가기 3"
              imageSrc="/path/to/image3.png"
              onClick={() => {
                console.log('바로가기 3 클릭');
              }}
            />
          </div>

          {/* 테이브 채널 바로가기 */}
          <div className="flex flex-col gap-11">
            <div>TAVE 채널 바로가기</div>
            <div className="flex w-full flex-1 flex-row gap-11">
              <Shortcut
                type="circle"
                label="테이브 채널"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('테이브 채널 클릭');
                }}
              />
              <Shortcut
                type="circle"
                label="테이브 채널"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('테이브 채널 클릭');
                }}
              />
              <Shortcut
                type="circle"
                label="테이브 채널"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('테이브 채널 클릭');
                }}
              />
              <Shortcut
                type="circle"
                label="테이브 채널"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('테이브 채널 클릭');
                }}
              />
            </div>
          </div>

          {/* 후원사 바로가기 */}
          <div className="flex flex-col gap-11">
            <div>후원사 바로가기</div>
            <div className="flex flex-row gap-11">
              <Shortcut
                type="circle"
                label="후원사"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('후원사 클릭');
                }}
              />
              <Shortcut
                type="circle"
                label="후원사"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('후원사 클릭');
                }}
              />
              <Shortcut
                type="circle"
                label="후원사"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('후원사 클릭');
                }}
              />
              <Shortcut
                type="circle"
                label="후원사"
                imageSrc="/path/to/tabe-channel.png"
                onClick={() => {
                  console.log('후원사 클릭');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
