import React from 'react';
import SolidButton from '../solid-button/SolidButton';
import TextButton from '../text-button/TextButton';

type SheetProps = {
  title?: string; // 시트 제목
  description?: string; // 시트 설명
  children: React.ReactNode; // 시트 내용
  primaryBtnLabel?: string; // 기본 솔리드 버튼
  secondaryBtnLabel?: string; // 두 번째 솔리드 버튼
  textBtnLabel?: string; // 텍스트 버튼
};

export function Sheet({
  title,
  description,
  children,
  primaryBtnLabel,
  secondaryBtnLabel,
  textBtnLabel,
}: SheetProps) {
  const renderTitleSection = () => (
    <div className="flex w-full flex-col gap-[0.25rem]">
      {title && <div className="text-foreground-normal text-body-16-600--1">{title}</div>}
      {description && (
        <div className="text-body-14-400--2-22 text-foreground-normal-darker">{description}</div>
      )}
    </div>
  );

  const renderButtons = () => {
    const hasBtn = primaryBtnLabel || secondaryBtnLabel || textBtnLabel;
    if (!hasBtn) return null;

    return (
      <div className="flex w-full flex-col gap-[0.62rem]">
        {(primaryBtnLabel || secondaryBtnLabel) && (
          <div className="flex w-full gap-[0.5rem]">
            {secondaryBtnLabel && (
              <SolidButton size="l" variant="secondary">
                {secondaryBtnLabel}
              </SolidButton>
            )}
            {primaryBtnLabel && (
              <SolidButton size="l" variant="primary">
                {primaryBtnLabel}
              </SolidButton>
            )}
          </div>
        )}
        {textBtnLabel && (
          <TextButton size="m" variant="secondary">
            {textBtnLabel}
          </TextButton>
        )}
      </div>
    );
  };

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
