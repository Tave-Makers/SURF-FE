'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsItem } from '@/entities/settings/ui/SettingsItem';
import { Alert } from '@/shared/ui/alert/Alert';
import { SETTINGS_ITEMS } from '../model/constants';
import type { AlertType } from '../model/types';

export const SettingsList = () => {
  const router = useRouter();
  const [activeAlert, setActiveAlert] = useState<AlertType>(null);

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

  // TODO: 로그아웃 및 회원탈퇴 훅 features 레이어에서 import 필요. 아래는 임시 코드
  const handleLogout = () => {
    console.log('로그아웃 처리');
    setActiveAlert(null);
  };

  const handleWithdraw = () => {
    console.log('회원탈퇴 처리');
    setActiveAlert(null);
  };
  // -------------------------------------

  const closeAlert = () => {
    setActiveAlert(null);
  };

  return (
    <div className="flex flex-1 flex-col items-start px-[1rem] pt-[0.62rem]">
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
