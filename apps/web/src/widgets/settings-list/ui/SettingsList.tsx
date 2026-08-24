'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useRouter } from 'next/navigation';
import { SETTINGS_ITEMS } from '../model/constants';
import { SettingsItem } from '@/entities/settings/ui/SettingsItem';
import { useLogout } from '@/features/auth/model/useLogout';
import { useWithdraw } from '@/features/auth/model/useWithdraw';
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/shared/config/contact';

export const SettingsList = () => {
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const { mutate: logoutMutate } = useLogout();
  const { mutate: withdrawMutate } = useWithdraw();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        closeAlert();
      },
    });
  };

  const handleWithdraw = () => {
    withdrawMutate(undefined, {
      onSuccess: () => {
        closeAlert();
      },
    });
  };

  const openLogoutAlert = () => {
    openAlert({
      state: 'default',
      title: '로그아웃',
      infoText: '정말 로그아웃하시겠습니까?',
      actions: [
        { type: 'solid', label: '취소', onClick: closeAlert, variant: 'secondary' },
        { type: 'solid', label: '로그아웃', onClick: handleLogout, variant: 'primary' },
      ],
    });
  };

  const handleItemClick = (item: (typeof SETTINGS_ITEMS)[number]) => {
    const { type, payload } = item.action;

    switch (type) {
      case 'NAVIGATE':
        if (payload) router.push(payload); // payload : string
        break;
      case 'OPEN_ALERT':
        if (payload === 'logout') openLogoutAlert();
        if (payload === 'withdraw') openWithdrawAlert();
        if (payload === 'contact') openContactAlert();
        break;
      default:
        break;
    }
  };

  // 메일 앱이 없는 기기에서도 주소를 확인할 수 있도록 본문에 이메일을 그대로 노출한다.
  const openContactAlert = () => {
    openAlert({
      state: 'default',
      title: '문의하기',
      infoText: `서비스 이용, 신고 처리, 개인정보 관련 문의는\n아래 이메일로 보내주세요.\n\n${SUPPORT_EMAIL}`,
      actions: [
        { type: 'solid', label: '닫기', onClick: closeAlert, variant: 'secondary' },
        {
          type: 'solid',
          label: '메일 보내기',
          onClick: () => {
            closeAlert();
            window.location.href = SUPPORT_MAILTO;
          },
          variant: 'primary',
        },
      ],
    });
  };

  const openWithdrawAlert = () => {
    openAlert({
      state: 'default',
      title: '정말 탈퇴하시겠습니까?',
      infoText: '한 번 탈퇴하면, 계정 정보가 저장되지 않으며\n회원가입이 어려워질 수 있어요.',
      actions: [
        { type: 'solid', label: '취소', onClick: closeAlert, variant: 'secondary' },
        { type: 'solid', label: '탈퇴하기', onClick: handleWithdraw, variant: 'danger' },
      ],
    });
  };

  return (
    <div className="flex flex-1 flex-col items-start gap-1 pt-10">
      {SETTINGS_ITEMS.map((item) => (
        <SettingsItem
          key={item.id}
          leftIconName={item.leftIconName}
          rightIconName="ChevronRight"
          isDisabled={false}
          onClick={() => handleItemClick(item)}
        >
          {item.text}
        </SettingsItem>
      ))}
    </div>
  );
};
