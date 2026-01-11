'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsItem } from '@/entities/settings/ui/SettingsItem';
import { Alert } from '@/shared/ui/alert/Alert';
import { SETTINGS_ITEMS } from '../model/constants';
import type { AlertType } from '../model/types';
import { useLogout } from '@/features/auth/model/useLogout';
import { useWithdraw } from '@/features/auth/model/useWithdraw';

export const SettingsList = () => {
  const router = useRouter();
  const [activeAlert, setActiveAlert] = useState<AlertType>(null);
  const { mutate: logoutMutate } = useLogout();
  const { mutate: withdrawMutate } = useWithdraw();

  const handleItemClick = useCallback(
    (item: (typeof SETTINGS_ITEMS)[number]) => {
      const { type, payload } = item.action;

      switch (type) {
        case 'NAVIGATE':
          if (payload) router.push(payload); // payload : string
          break;
        case 'OPEN_ALERT':
          setActiveAlert(payload); // payload : AlertType
          break;
        default:
          break;
      }
    },
    [router],
  );

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        setActiveAlert(null);
      },
    });
  };

  const handleWithdraw = () => {
    withdrawMutate(undefined, {
      onSuccess: () => {
        setActiveAlert(null);
      },
    });
  };

  const closeAlert = () => {
    setActiveAlert(null);
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

      {/* Alert Modals */}
      <Alert
        state="default"
        title="정말 로그아웃 하시겠습니까?"
        actions={[
          { type: 'solid', label: '취소', onClick: closeAlert, variant: 'secondary' },
          { type: 'solid', label: '로그아웃', onClick: handleLogout, variant: 'primary' },
        ]}
        isOpen={activeAlert === 'logout'}
        onClose={closeAlert}
      />
      <Alert
        state="default"
        title="정말 탈퇴하시겠습니까?"
        infoText={`탈퇴한 후에는 서비스 이용 기록이 삭제되며,\n복구가 불가능합니다.`}
        actions={[
          { type: 'solid', label: '취소', onClick: closeAlert, variant: 'secondary' },
          { type: 'solid', label: '탈퇴하기', onClick: handleWithdraw, variant: 'danger' },
        ]}
        isOpen={activeAlert === 'withdraw'}
        onClose={closeAlert}
      />
    </div>
  );
};
