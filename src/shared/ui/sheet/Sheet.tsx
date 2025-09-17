import React from 'react';
import SolidButton from '../solid-button/SolidButton';
import TextButton from '../text-button/TextButton';

type SheetProps = {
  title?: string; // 시트 제목
  description?: string; // 시트 설명
  children: React.ReactNode; // 시트 내용
  hasTitleSection?: boolean; // 제목 및 설명 표시 여부
  hasGrabber?: boolean; // 그랩바 표시 여부
  hasBtn?: boolean; // 버튼 표시 여부
  hasTwoSolidBtns?: boolean; // 두 개의 솔리드 버튼 표시 여부
  hasTextBtn?: boolean; // 텍스트 버튼 표시 여부
  primaryBtnLabel?: string; // 기본 솔리드 버튼
  secondaryBtnLabel?: string; // 두 번째 솔리드 버튼
  textBtnLabel?: string; // 텍스트 버튼
};

export default function Sheet({
  title = 'Title',
  description = 'Description',
  children,
  hasTitleSection = true,
  hasBtn = true,
  hasTwoSolidBtns = false,
  hasTextBtn = true,
  primaryBtnLabel = '선택하기',
  secondaryBtnLabel = '취소하기',
  textBtnLabel = '자세히 보기',
}: SheetProps) {
  const renderTitleSection = () =>
    hasTitleSection && (
      <div className="flex w-full flex-col gap-[0.25rem]">
        <div className="text-[color: var(--color-foreground-normal)] text-body-16-600--1">
          {title}
        </div>
        <div className="text-body-14-400--2-22 text-[color:var(--color-foreground-normal-darker)]">
          {description}
        </div>
      </div>
    );

  const renderButtons = () =>
    hasBtn && (
      <div className="flex w-full flex-col gap-[0.62rem]">
        <div className="flex w-full gap-[0.5rem]">
          {hasTwoSolidBtns && (
            <SolidButton size="l" variant="secondary">
              {secondaryBtnLabel}
            </SolidButton>
          )}
          <SolidButton size="l" variant="primary">
            {primaryBtnLabel}
          </SolidButton>
        </div>
        {hasTextBtn && (
          <TextButton size="m" variant="secondary">
            {textBtnLabel}
          </TextButton>
        )}
      </div>
    );

  return (
    <div className="flex w-full flex-col items-start gap-[1.25rem] rounded-t-[0.5rem] bg-white px-[1.25rem] pt-[0.75rem] pb-[1.25rem]">
      <div className="flex w-full flex-col items-start gap-[0.5rem] py-[0.625rem]">
        {renderTitleSection()}
        <div className="w-full">{children}</div>
      </div>
      {renderButtons()}
    </div>
  );
}
