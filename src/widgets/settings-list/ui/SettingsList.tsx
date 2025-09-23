'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsItem } from '../../../entities/settings/ui/SettingsItem';
import { Alert } from '@/shared/ui/alert/Alert';

export const SettingsList = () => {
  const router = useRouter();

  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const [isWithdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-start self-stretch pt-[0.62rem]">
      <SettingsItem
        leftIconName="Bookmark"
        rightIconName="ChevronRight"
        isDisabled={false}
        onClick={() => router.push('/mypage/scraps')}
      >
        내가 스크랩한 게시글
      </SettingsItem>
      <SettingsItem
        leftIconName="Edit"
        rightIconName="ChevronRight"
        isDisabled={false}
        onClick={() => router.push('/mypage/my-posts')}
      >
        내가 작성한 게시글
      </SettingsItem>
      <SettingsItem
        leftIconName="File"
        rightIconName="ChevronRight"
        isDisabled={false}
        // 현재 FAQ 화면이 없어 라우터는 작성하지 않음
        onClick={() => router.push('')}
      >
        FAQ
      </SettingsItem>
      <SettingsItem
        leftIconName="ChatDots"
        rightIconName="ChevronRight"
        isDisabled={false}
        onClick={() => router.push('/mypage/feedback')}
      >
        피드백 보내기
      </SettingsItem>
      <SettingsItem
        leftIconName="InfoCircle"
        rightIconName="ChevronRight"
        isDisabled={false}
        onClick={() => router.push('/mypage/policy')}
      >
        이용약관
      </SettingsItem>
      <SettingsItem
        leftIconName="Logout"
        rightIconName="ChevronRight"
        isDisabled={false}
        onClick={() => setLogoutOpen(true)}
      >
        로그아웃
      </SettingsItem>
      <SettingsItem
        leftIconName="XCircle"
        rightIconName="ChevronRight"
        isDisabled={false}
        onClick={() => setWithdrawOpen(true)}
      >
        회원탈퇴
      </SettingsItem>

      {/* Alert Modal */}
      <Alert
        state="default"
        title="정말 로그아웃 하시겠습니까?"
        actions={[
          {
            type: 'solid',
            label: '취소',
            onClick: () => setLogoutOpen(false),
            variant: 'secondary',
          },
          {
            type: 'solid',
            label: '로그아웃',
            // 클릭 이벤트 함수 변경 필요
            onClick: () => console.log('로그아웃'),
            variant: 'primary',
          },
        ]}
        isOpen={isLogoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
      <Alert
        state="default"
        title="정말 탈퇴하시겠습니까?"
        infoText={`탈퇴한 후에는 서비스 이용 기록이 삭제되며,\n복구가 불가능합니다.`}
        actions={[
          {
            type: 'solid',
            label: '취소',
            onClick: () => setWithdrawOpen(false),
            variant: 'secondary',
          },
          {
            type: 'solid',
            label: '탈퇴하기',
            // 클릭 이벤트 함수 변경 필요
            onClick: () => {},
            variant: 'danger',
          },
        ]}
        isOpen={isWithdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />
    </div>
  );
};
