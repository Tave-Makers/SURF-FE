'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Callout } from '@/entities/note/ui/callout/Callout';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { SolidButton } from '@/shared/ui/button/solid-button/SolidButton';
import { useMemo, useState } from 'react';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { Alert } from '@/shared/ui/alert/Alert';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { useSendMessage } from '@/entities/message/model/useSendMessage';

export function SendMessagePage() {
  // 쿼리 파라미터
  const searchParams = useSearchParams();
  const memberId = searchParams.get('memberId');
  const nickname = searchParams.get('nickname') ?? undefined;
  const profileImageUrl = searchParams.get('profileImageUrl') ?? undefined;

  // 폼 상태
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [additionalSns, setAdditionalSns] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // Alert open 상태
  const [isExitAlertOpen, setIsExitAlertOpen] = useState<boolean>(false);
  const [isSendAlertOpen, setIsSendAlertOpen] = useState<boolean>(false);

  const keyboardOffset = useKeyboardOffset();
  const router = useRouter();

  // 쪽지 전송 mutation
  const { mutate: sendMessage, isPending } = useSendMessage();

  // 작성 중 나가기 (뒤로가기)
  function handleExit() {
    setIsExitAlertOpen(false);
    router.back();
  }

  // 쪽지 전송
  function handleSend() {
    if (!memberId) return;

    sendMessage(
      {
        receiverId: Number(memberId),
        title,
        content,
        replyEmail: senderEmail,
        sns: additionalSns || undefined,
      },
      {
        onSuccess: () => {
          setIsSendAlertOpen(false);
          // TODO: 리뷰 후 머지 시 적용 예정
          // router.back();
        },
      },
    );
  }

  // 이메일 형식 검증
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /**
   CTA 활성화 조건
     1. 이메일 형식 유효
     2. 제목/본문 최소 길이 충족
   */
  const isCtaEnabled = useMemo(() => {
    return isValidEmail(senderEmail) && title.trim().length >= 10 && content.trim().length >= 10;
  }, [senderEmail, title, content]);

  const canSend = Boolean(memberId) && isCtaEnabled && !isPending;

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        customBack={() => setIsExitAlertOpen(true)}
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '쪽지 보내기',
          hasLeftIcon: true,
        }}
      />

      <Callout userImage={profileImageUrl} userName={nickname} />

      <div className="scrollbar-hide flex w-full flex-1 flex-col gap-[1.875rem] overflow-y-auto px-[1.5rem] py-[1rem]">
        <FieldGroup title="회신받을 본인 이메일" isRequired>
          <TextArea
            placeholder="ex. tavemakers@gmail.com"
            value={senderEmail}
            onChange={setSenderEmail}
          />
        </FieldGroup>
        <FieldGroup title="추가로 연락받고 싶은 SNS">
          <TextArea
            placeholder="ex) 인스타그램/ @tavemakers"
            value={additionalSns}
            onChange={setAdditionalSns}
          />
        </FieldGroup>
        <FieldGroup title="제목" isRequired>
          <TextArea
            placeholder="쪽지를 보내는 경위를 간략하게 작성해주세요!"
            value={title}
            onChange={setTitle}
          />
        </FieldGroup>
        <FieldGroup title="본문" isRequired>
          <TextArea
            placeholder="해당 멤버에게 궁금한 내용을 자세하게 작성해주세요. 이야기 나누고 싶은 주제를 쉽게 이해할 수 있도록 회원님에 대해 간단하게 소개해 주시면 더 좋아요"
            value={content}
            onChange={setContent}
            mode="multiLine"
          />
        </FieldGroup>
      </div>
      {/* 쪽지 보내기 버튼 */}
      <div className="w-full px-13 pt-13 pb-15" style={{ paddingBottom: keyboardOffset + 15 }}>
        <SolidButton
          size="l"
          variant="primary"
          onClick={() => setIsSendAlertOpen(true)}
          isDisabled={!isCtaEnabled || isPending}
        >
          {isPending ? '전송 중' : '쪽지 보내기'}
        </SolidButton>
      </div>

      {/* 삭제 Alert */}
      <Alert
        state="default"
        title="정말로 나가시겠습니까?"
        infoText="쪽지 작성 중 나갈 경우, 작성된 내용은 저장되지 않습니다."
        isOpen={isExitAlertOpen}
        onClose={() => setIsExitAlertOpen(false)}
        actions={[
          {
            type: 'solid',
            variant: 'secondary',
            label: '취소',
            onClick: () => setIsExitAlertOpen(false),
          },
          {
            type: 'solid',
            variant: 'danger',
            label: '나가기',
            onClick: handleExit,
          },
        ]}
      />
      {/* 전송 Alert */}
      <Alert
        state="default"
        title="작성한 쪽지를 보내겠습니까?"
        infoText="보내신 쪽지는 상대방의 이메일로 전송됩니다."
        isOpen={isSendAlertOpen}
        onClose={() => setIsSendAlertOpen(false)}
        actions={[
          {
            type: 'solid',
            variant: 'secondary',
            label: '취소',
            onClick: () => setIsSendAlertOpen(false),
            isDisabled: isPending,
          },
          {
            type: 'solid',
            variant: 'primary',
            label: isPending ? '전송 중' : '전송하기',
            onClick: () => void handleSend(),
            isDisabled: !canSend,
          },
        ]}
      />
    </div>
  );
}
