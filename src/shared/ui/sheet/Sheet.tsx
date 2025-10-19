'use client';
import React from 'react';
import { SolidButton } from '../solid-button/SolidButton';
import { TextButton } from '../text-button/TextButton';

type SheetButton = {
  label: string;
  onClick?: () => void;
};

type SheetProps = {
  title?: string; // 시트 제목
  description?: string; // 시트 설명
  children: React.ReactNode; // 시트 내용
  primaryBtn?: SheetButton; // 기본 솔리드 버튼
  secondaryBtn?: SheetButton; // 두 번째 솔리드 버튼
  textBtn?: SheetButton; // 텍스트 버튼
};

export function Sheet({
  title,
  description,
  children,
  primaryBtn,
  secondaryBtn,
  textBtn,
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
    const hasBtn = primaryBtn || secondaryBtn || textBtn;
    if (!hasBtn) return null;

    return (
      <div className="flex w-full flex-col gap-[0.62rem]">
        {(primaryBtn || secondaryBtn) && (
          <div className="flex w-full gap-[0.5rem]">
            {secondaryBtn && (
              <SolidButton
                type="button"
                size="l"
                variant="secondary"
                onClick={secondaryBtn.onClick}
              >
                {secondaryBtn.label}
              </SolidButton>
            )}
            {primaryBtn && (
              <SolidButton type="button" size="l" variant="primary" onClick={primaryBtn.onClick}>
                {primaryBtn.label}
              </SolidButton>
            )}
          </div>
        )}
        {textBtn && (
          <TextButton type="button" size="m" variant="secondary" onClick={textBtn.onClick}>
            {textBtn.label}
          </TextButton>
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col items-start gap-[1.25rem] rounded-t-[0.5rem] bg-white px-[1.25rem] pb-[1.25rem]">
      <div className={`flex w-full flex-col items-start ${title ? 'gap-[0.5rem]' : ''}`}>
        {renderTitleSection()}
        <div
          className="w-full"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
      {renderButtons()}
    </div>
  );
}
