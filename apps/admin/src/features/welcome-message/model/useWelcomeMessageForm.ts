import { useEffect, useState } from 'react';
import { useWelcomeMessageQuery } from './queries/useWelcomeMessageQuery';
import { useUpdateWelcomeMessageMutation } from './queries/useUpdateWelcomeMessageMutation';

/**
 * 웰컴 메시지 조회·수정 페이지의 상태와 액션을 관리하는 훅.
 *
 * - 조회한 서버 데이터를 로컬 편집 상태(mainMessage, subMessage)로 복사해 두어
 *   편집 취소(handleBack) 시 서버 데이터가 자동으로 재적용되도록 한다.
 * - 수정 성공 시 isEditMode를 false로 전환하는 onSuccess 콜백을 mutate에 직접 주입하여
 *   토스트(전역) · 모드 전환(로컬)의 책임을 분리한다.
 */
export const useWelcomeMessageForm = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mainMessage, setMainMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');

  const { data } = useWelcomeMessageQuery();
  const { mutate, isPending } = useUpdateWelcomeMessageMutation();

  useEffect(() => {
    if (!data) return;
    setMainMessage(data.message);
    setSubMessage(data.sender);
  }, [data]);

  const canSubmit = mainMessage.trim().length > 0 && subMessage.trim().length > 0;

  const handleEdit = () => setIsEditMode(true);
  const handleBack = () => setIsEditMode(false);
  const handleSubmit = () => {
    mutate({ message: mainMessage, sender: subMessage }, { onSuccess: () => setIsEditMode(false) });
  };

  return {
    state: { isEditMode, mainMessage, subMessage, canSubmit, isPending },
    actions: { setMainMessage, setSubMessage, handleEdit, handleBack, handleSubmit },
  };
};
