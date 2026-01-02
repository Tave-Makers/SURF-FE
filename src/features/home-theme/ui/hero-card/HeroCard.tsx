import { useId } from 'react';

interface UserData {
  name: string;
  batch: number;
  part: string;
}

interface NoticeData {
  title: string;
  sender: string;
}

interface ImgData {
  bgImgUrl: string;
  charImgUrl: string;
  isDark: boolean;
}

export interface HeroCardProps {
  userData: UserData;
  noticeData: NoticeData;
  imgData: ImgData;
}

export function HeroCard({ userData, noticeData, imgData }: HeroCardProps) {
  const id = useId();

  const rectWidth = 375;
  const rectHeight = 311.5;
  const rectX = -187.5;
  const rectY = -311.5;
  const radius = 1250;
  const circleY = -1250;

  const charSize = 187.5;
  const charX = rectWidth / 2 - charSize; // 187.5 - 187.5 = 0
  const charY = 0 - charSize;

  const textColor = imgData.isDark
    ? 'text-foreground-static-white'
    : 'text-foreground-static-black';

  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <svg
        viewBox={`${rectX} ${rectY} ${rectWidth} ${rectHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full"
      >
        <defs>
          {/* 배경 이미지 */}

          <pattern
            id={`bg-pattern-${id}`}
            patternUnits="userSpaceOnUse"
            x={rectX}
            y={rectY}
            width={rectWidth}
            height={rectHeight}
          >
            <image
              href={imgData.bgImgUrl}
              width={rectWidth}
              height={rectHeight}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>

          {/* 원호 클리핑 */}
          <clipPath id={`arc-clip-${id}`}>
            <circle cx="0" cy={circleY} r={radius} />
          </clipPath>
        </defs>

        {/* 배경 레이어 클리핑 적용 */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill={`url(#bg-pattern-${id})`}
          clipPath={`url(#arc-clip-${id})`}
        />

        {/* 캐릭터 이미지 */}
        <g clipPath={`url(#arc-clip-${id})`}>
          <image
            href={imgData.charImgUrl}
            x={charX}
            y={charY}
            width={charSize}
            height={charSize}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>

      {/* 텍스트 레이어 */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
        <div className="mt-[4.875rem] flex flex-col gap-1 px-15">
          <h1 className={`text-body-body5 ${textColor} truncate`}>{noticeData.title}</h1>
          <h2 className={`text-body-body9 ${textColor} truncate`}>{noticeData.sender}</h2>
        </div>

        <div className="mt-auto mb-[2.5rem] ml-15 flex w-fit flex-col">
          <span className={`text-body-body8 ${textColor} truncate`}>{userData.name}</span>
          <span className={`text-body-body9 ${textColor} truncate`}>{userData.batch}기</span>
          <span className={`text-body-body9 ${textColor} truncate`}>{userData.part}</span>
        </div>
      </div>
    </div>
  );
}
