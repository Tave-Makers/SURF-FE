'use client';

import { useState } from 'react';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
// import { Textarea } from '@/shared/ui/Textarea';
import { useSubmitFeedback } from '../model/useSubmitFeedback';

export const FeedbackForm = () => {
  const [content, setContent] = useState('');
  const { mutate: submit, isPending } = useSubmitFeedback();

  const handleSubmit = () => {
    if (!content.trim() || isPending) return;
    submit({ content });
    setContent('사랑하는 친구야, 새로운 생명을 품고 있는 너의 모습이 참 아름답고 경이로워...');
  };

  return (
    <div className="flex flex-col px-[1rem]">
      <div className="flex flex-col gap-[0.62rem] pb-[27.31rem]">
        <div className="self-fretch items-start">
          <span className="text-body-16-600--1 text-foreground-normal">
            SURF를 위한 메시지를 남겨주세요!
          </span>
        </div>

        <div className="flex">
          {/* <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="사랑하는 친구야, 새로운 생명을 품고 있는 너의 모습이 참 아름답고 경이로워..."
          className="h-full w-full resize-none"
        /> */}
        </div>
      </div>

      <div className="pt-[1rem] pb-[1.25rem]">
        <SolidButton size="l" variant="primary" onClick={handleSubmit} className="mt-4">
          {isPending ? '보내는 중...' : '보내기'}
        </SolidButton>
      </div>
    </div>
  );
};
