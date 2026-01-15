'use client';

import React from 'react';
import { SolidButton } from '../button/solid-button/SolidButton';
import { TextButton } from '../button/text-button/TextButton';

/**
 * 하단에서 노출되는 Bottom Sheet 컨테이너 컴포넌트
 * - 상단 드래그 핸들 영역(header)
 * - 제목/설명 영역
 * - 스크롤 가능한 콘텐츠 영역
 *
 * @param props - Sheet 컴포넌트 props
 * @param props.title - 시트 상단에 표시되는 제목 텍스트
 * @param props.description - 제목 하단에 표시되는 보조 설명 텍스트
 * @param props.children - 스크롤 가능한 시트 본문 콘텐츠
 * @param props.primaryBtn - 시트 하단의 기본 솔리드 버튼
 * @param props.secondaryBtn - 시트 하단의 두 번째 솔리드 버튼
 * @param props.textBtn - 시트 하단의 기본 텍스트 버튼
 *
 */

interface SheetButton {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}

interface SheetProps {
  title?: string; // 시트 제목
  description?: string; // 시트 설명
  children: React.ReactNode; // 시트 내용
  primaryBtn?: SheetButton; // 기본 솔리드 버튼
  secondaryBtn?: SheetButton; // 두 번째 솔리드 버튼
  textBtn?: SheetButton; // 텍스트 버튼
}

export const Sheet = ({
  title,
  description,
  children,
  primaryBtn,
  secondaryBtn,
  textBtn,
}: SheetProps) => {
  const renderTitleSection = () => (
    <div className="flex w-full flex-col gap-5">
      {title && (
        <div id="sheet-title" className="text-foreground-normal text-title-title2">
          {title}
        </div>
      )}
      {description && <div className="text-body-body9 text-foreground-tertiary">{description}</div>}
    </div>
  );

  const renderButtons = () => {
    const hasBtn = primaryBtn || secondaryBtn || textBtn;
    if (!hasBtn) return null;

    return (
      <div className="flex w-full flex-col gap-10">
        {(primaryBtn || secondaryBtn) && (
          <div className="flex w-full gap-10">
            {secondaryBtn && (
              <SolidButton
                type="button"
                size="l"
                variant={secondaryBtn.variant || 'secondary'}
                isDisabled={secondaryBtn.disabled}
                onClick={secondaryBtn.onClick}
              >
                {secondaryBtn.label}
              </SolidButton>
            )}
            {primaryBtn && (
              <SolidButton
                type="button"
                size="l"
                variant={primaryBtn.variant || 'primary'}
                isDisabled={primaryBtn.disabled}
                onClick={primaryBtn.onClick}
              >
                {primaryBtn.label}
              </SolidButton>
            )}
          </div>
        )}
        {textBtn && (
          <TextButton
            type="button"
            size="m"
            variant="secondary"
            isDisabled={textBtn.disabled}
            onClick={textBtn.onClick}
          >
            {textBtn.label}
          </TextButton>
        )}
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'sheet-title' : undefined}
      aria-describedby={description}
      className="rounded-t-4 bg-background-normal flex w-full flex-col items-start"
    >
      <header className="flex w-full justify-center pt-11" aria-label="드래그 핸들">
        <div
          className="bg-foreground-tertiary rounded-max h-[0.3125rem] w-[2.25rem]"
          aria-hidden="true"
        />
      </header>
      <div className="px-15 flex w-full flex-col pt-11">
        {renderTitleSection()}
        <div
          className="scroll-hide max-h-[308px] w-full overflow-y-auto"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
      <div className="px-15 pb-15 w-full">{renderButtons()}</div>
    </div>
  );
};
