'use client';

import { useState } from 'react';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
import { useSubmitFeedback } from '../../../features/submit-feedback/api/useSubmitFeedback';

const MAX_LENGTH = 500;

export const FeedbackForm = () => {
  const [content, setContent] = useState('');
  const { mutate: submit, isPending } = useSubmitFeedback();

  const handleSubmit = () => {
    if (!content.trim() || isPending) return;
    submit({ content });
  };

  const isContentValid = content.trim().length > 0;
  const remainingChars = MAX_LENGTH - content.length;

  return (
    <div className="flex flex-col px-[1rem]">
      <div className="flex flex-col gap-[0.62rem] pt-[1.25rem] pb-[32.81rem]">
        {/* 타이틀 섹션 */}
        <div className="items-start self-stretch">
          <span className="text-body-16-600--1 text-foreground-normal">
            SURF를 위한 메시지를 남겨주세요!
          </span>
        </div>

        {/* 아래 textarea 섹션 추후 수정 */}
        <div className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_LENGTH}
            placeholder="SURF 서비스에 대한 의견이나 개선사항을 자유롭게 작성해주세요..."
            className="w-full resize-none rounded-lg border border-gray-300 bg-white p-4 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <div className="flex justify-end">
            <span className={`text-xs ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-[1rem] pb-[1.25rem]">
        <SolidButton
          size="l"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={!isContentValid || isPending}
        >
          {isPending ? '보내는 중...' : '보내기'}
        </SolidButton>
      </div>
    </div>
  );
};
