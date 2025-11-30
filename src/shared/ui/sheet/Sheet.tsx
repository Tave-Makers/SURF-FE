'use client';

import React from 'react';
import { SolidButton } from '../button/solid-button/SolidButton';
import { TextButton } from '../button/text-button/TextButton';

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
    <div className="flex w-full flex-col gap-5">
      {title && <div className="text-foreground-foreground-normal text-title-title2">{title}</div>}
      {description && (
        <div className="text-body-body8 text-foreground-foreground-tertiary">{description}</div>
      )}
    </div>
  );

  const renderButtons = () => {
    const hasBtn = primaryBtn || secondaryBtn || textBtn;
    if (!hasBtn) return null;

    return (
      <div className="flex w-full flex-col gap-[0.62rem]">
        {(primaryBtn || secondaryBtn) && (
          <div className="flex w-full gap-10">
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
    <div className="rounded-t-4 flex w-full flex-col items-start gap-15 bg-white px-15 pt-11 pb-15">
      <div className={`flex w-full flex-col items-start ${title ? 'gap-15' : ''}`}>
        {renderTitleSection()}
        <div
          className="scroll-hide max-h-[308px] w-full overflow-y-auto"
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
