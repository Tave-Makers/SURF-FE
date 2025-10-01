'use client';

import { useState } from 'react';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
import { usePostFeedback } from '@/features/feedback/model/usePostFeedback';
import { TextArea } from '@/shared/ui/text-area/TextArea';

export const FeedbackForm = () => {
  const [content, setContent] = useState('');
  const { mutate: submit, isPending } = usePostFeedback();

  const handleSubmit = () => {
    if (!content.trim() || isPending) return;
    submit({ content });
  };

  const isContentValid = content.trim().length > 0;

  return (
    <div className="flex h-full flex-col px-[1rem]">
      <div className="flex flex-1 flex-col gap-[0.62rem] pt-[1.25rem]">
        {/* 타이틀 섹션 */}
        <div className="items-start self-stretch">
          <span className="text-body-16-600--1 text-foreground-normal">
            SURF를 위한 메시지를 남겨주세요!
          </span>
        </div>

        {/* Textarea 섹션 */}
        <div className="flex flex-col gap-2">
          <TextArea
            value={content}
            mode="multiLine"
            onChange={(content) => setContent(content)}
            textLimit={500}
          />
        </div>
      </div>

      {/* 버튼 섹션 */}
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
