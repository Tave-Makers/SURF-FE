'use client';

import { AnnouncementBar } from '@/entities/schedule/ui/announcement-bar/AnnouncementBar';
import { Carousel } from '@/shared/ui/carousel/Carousel';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Shortcut } from '@/shared/ui/shortcut/Shortcut';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const HomePage = () => {
  const handleBack = () => {
    // 뒤로 가기 로직
  };

  const sampleImages = [
    { src: 'https://public.mujikorea.co.kr/images/plans/2510_men_bn_pc.jpg', alt: '샘플 이미지 1' },
    {
      src: 'https://public.mujikorea.co.kr/images/products/categories/kPekPdSyST6wgk6RqUVZz0JnquFG6rhmTmEjJL5H.jpg',
      alt: '샘플 이미지 2',
    },
    {
      src: 'https://public.mujikorea.co.kr/images/products/categories/mjPpw4Qa3Ds4faXJOmFhHIhD83YQqC88jPFYxbFZ.jpg',
      alt: '샘플 이미지 3',
    },
  ];

  return (
    <div className="overflow-y-auto pb-20">
      <div className="absolute z-10 px-13 py-11 sm:w-[360px]">
        {/* AppHeader */}
        <AppHeader
          customBack={handleBack}
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
        <div className="bg-foreground-normal-lighter h-85 w-full"></div>

        <div className="flex flex-col gap-16 px-13 pt-15">
          {/* Announcement Bar */}
          <AnnouncementBar
            title="공지사항"
            date={new Date()}
            category="official"
            onClick={() => {
              console.log('공지사항 클릭');
            }}
          />

          {/* Carousel */}
          <Carousel images={sampleImages} />

          {/* Shortcut Buttons */}
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
            <div className="flex flex-row gap-11">
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
