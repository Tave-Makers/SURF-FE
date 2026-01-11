'use client';

import { useState } from 'react';
import { SolidButton } from '@surf/ui/button';
import { usePostFeedback } from '@/features/feedback/model/usePostFeedback';
import { TextArea } from '@surf/ui/text-area';
import { FEEDBACK_EVENTS } from '@/features/feedback/model/types';
import { trackFeedbackEvent } from '@/features/feedback/lib/trackFeedbackEvent';

export const FeedbackForm = () => {
  const [content, setContent] = useState('');
  const { mutate: submit, isPending } = usePostFeedback();

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    const textLength = trimmed.length;

    submit(
      { content: trimmed },
      {
        onSuccess: () => {
          trackFeedbackEvent(FEEDBACK_EVENTS.SUBMITTED_FEEDBACK_TEXT_LENGTH, {
            text_length: textLength,
          });
          setContent('');
        },
        onError: () => {},
      },
    );
  };

  const isContentValid = content.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-10 px-13 pt-15">
        {/* 타이틀 섹션 */}
        <div className="items-start self-stretch">
          <span className="text-title-title2 text-foreground-normal">
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
      <div className="px-13 pt-13 pb-15">
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
