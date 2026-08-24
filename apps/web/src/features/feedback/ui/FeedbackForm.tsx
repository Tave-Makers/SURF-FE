'use client';

import { SolidButton } from '@surf/ui/button';
import { TextArea } from '@surf/ui/text-area';
import { useState } from 'react';
import { trackFeedbackEvent } from '@/features/feedback/lib/trackFeedbackEvent';
import { FEEDBACK_EVENTS } from '@/features/feedback/model/types';
import { usePostFeedback } from '@/features/feedback/model/usePostFeedback';
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/shared/config/contact';

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
        <div className="flex flex-col items-start gap-4 self-stretch">
          <span className="text-title-title2 text-foreground-normal">
            SURF를 위한 메시지를 남겨주세요!
          </span>
          {/*
            아래 폼은 단방향 전송이라 회신 경로가 없다.
            App Store 심사 지침 1.2·1.5가 요구하는 '게시된 개발자 연락처'는
            링크가 아니라 주소 자체가 화면에 보여야 충족되므로 문자열을 그대로 노출한다.
          */}
          <p className="text-body-body9 text-foreground-tertiary">
            보내주신 의견은 운영팀이 확인합니다. 답변이 필요한 문의나 신고 처리·개인정보 관련 요청은{' '}
            <a href={SUPPORT_MAILTO} className="text-foreground-normal underline">
              {SUPPORT_EMAIL}
            </a>
            로 보내주시면 영업일 기준 3일 이내에 답변드립니다.
          </p>
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
