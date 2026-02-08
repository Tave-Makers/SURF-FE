'use client';

import { useKeyboardOffset } from '@surf/hooks';
import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { HeaderMode } from '@surf/ui/header';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextArea } from '@surf/ui/text-area';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useSendMessage } from '@/entities/message/model/useSendMessage';
import { Callout } from '@/entities/message/ui/callout/Callout';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const SendMessagePage = () => {
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

  // 알러트/토스트 스토어
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((state) => state.show);

  // 본문/제목 최소 글자 수
  const MIN_LENGTH = 10;

  const keyboardOffset = useKeyboardOffset();
  const router = useRouter();

  // 쪽지 전송 mutation
  const { mutate: sendMessage, isPending } = useSendMessage();

  // 작성 중 나가기 (뒤로가기)
  function handleExit() {
    openAlert({
      state: 'default',
      title: '정말로 나가시겠습니까?',
      infoText: '쪽지 작성 중 나갈 경우, 작성된 내용은 저장되지 않습니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'danger',
          label: '나가기',
          onClick: () => {
            closeAlert();
            router.back();
          },
        },
      ],
    });
  }

  // 쪽지 전송
  function handleSend() {
    if (validMemberId === null) return;

    sendMessage(
      {
        receiverId: validMemberId,
        title,
        content,
        replyEmail: senderEmail,
        sns: additionalSns || undefined,
      },
      {
        onSuccess: () => {
          showToast('상대방의 이메일로 쪽지가 발송되었습니다.');
          closeAlert();
          router.back();
        },
      },
    );
  }

  // 쪽지 전송 알러트
  const handleOpenSendAlert = () => {
    openAlert({
      state: 'default',
      title: '작성한 쪽지를 보내겠습니까?',
      infoText: '보내신 쪽지는 상대방의 이메일로 전송됩니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
          isDisabled: isPending,
        },
        {
          type: 'solid',
          variant: 'primary',
          label: isPending ? '전송 중' : '전송하기',
          onClick: handleSend,
          isDisabled: !isBtnEnabled,
        },
      ],
    });
  };

  // 이메일 형식 검증
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 회원 아이디 검증
  const validMemberId = useMemo(() => {
    const id = Number(memberId);
    return Number.isInteger(id) && id > 0 ? id : null;
  }, [memberId]);

  // 이메일 에러 메시지
  const emailErrorMessage = useMemo(() => {
    if (senderEmail.length === 0) return undefined;

    if (!isValidEmail(senderEmail)) {
      return '올바른 형태의 이메일을 입력해주세요.';
    }

    return undefined;
  }, [senderEmail]);

  // 버튼 활성화 조건
  const isBtnEnabled =
    !isPending &&
    validMemberId !== null &&
    isValidEmail(senderEmail) &&
    title.trim().length >= MIN_LENGTH &&
    content.trim().length >= MIN_LENGTH;

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        customBack={handleExit}
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '쪽지 보내기',
          hasLeftIcon: true,
        }}
      />

      <Callout userImage={profileImageUrl} userName={nickname} />

      <div className="flex w-full flex-1 flex-col gap-[1.875rem] overflow-y-auto px-[1.5rem] py-[1rem]">
        <FieldGroup title="회신받을 본인 이메일" isRequired>
          <TextArea
            placeholder="ex) tavemakers@gmail.com"
            value={senderEmail}
            onChange={setSenderEmail}
            readOnly={isPending}
            errorMessage={emailErrorMessage}
          />
        </FieldGroup>
        <FieldGroup title="추가로 연락받고 싶은 SNS">
          <TextArea
            placeholder="ex) 인스타그램/ @tavemakers"
            value={additionalSns}
            onChange={setAdditionalSns}
            readOnly={isPending}
          />
        </FieldGroup>
        <FieldGroup title="제목" isRequired>
          <TextArea
            placeholder="쪽지를 보내는 경위를 간략하게 작성해주세요!"
            value={title}
            onChange={setTitle}
            guideMessage={`${MIN_LENGTH}자 이상 작성해주세요.`}
            readOnly={isPending}
          />
        </FieldGroup>
        <FieldGroup title="본문" isRequired>
          <TextArea
            placeholder="해당 멤버에게 궁금한 내용을 자세하게 작성해주세요. 이야기 나누고 싶은 주제를 쉽게 이해할 수 있도록 회원님에 대해 간단하게 소개해 주시면 더 좋아요."
            value={content}
            onChange={setContent}
            mode="multiLine"
            guideMessage={`${MIN_LENGTH}자 이상 작성해주세요.`}
            readOnly={isPending}
          />
        </FieldGroup>
      </div>
      {/* 쪽지 보내기 버튼 */}
      <div className="w-full px-13 pt-13 pb-15" style={{ paddingBottom: keyboardOffset + 15 }}>
        <SolidButton
          size="l"
          variant="primary"
          onClick={handleOpenSendAlert}
          isDisabled={!isBtnEnabled}
        >
          {isPending ? '전송 중' : '쪽지 보내기'}
        </SolidButton>
      </div>
    </div>
  );
};
