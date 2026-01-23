'use client';

import { HeaderMode } from '@surf/ui/header';
import { useToastStore } from '@surf/ui/store/toastStore';
import { Tab } from '@surf/ui/tab';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { NotificationTab } from '@/entities/notification/model/notificationTab';
import { useGetNotifications } from '@/entities/notification/model/useGetNotifications';
import { useReadNotification } from '@/entities/notification/model/useReadNotification';
import { NotificationList } from '@/entities/notification/ui/NotificationList';
import NotificationEmpty from '@/shared/assets/icons/empty-space/notification-empty.svg';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

// const NotificationEmpty = dynamic(
//   () => import('@/shared/assets/icons/empty-space/notification-empty.svg'),
//   {
//     ssr: false,
//       loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
//   },
// );

const tabItems = [
  { value: 'ALL', label: '전체' },
  { value: 'ACTIVITY', label: '활동' },
  { value: 'SCHEDULE', label: '일정' },
];

export const NotificationPage = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<NotificationTab>('ALL');
  const showToast = useToastStore((state) => state.show);

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'denied') {
      // 이미 거부된 경우 브라우저 설정 유도
      showToast('알림 권한이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.');
    }
  }, [showToast]);

  const { data, isLoading } = useGetNotifications(currentTab);
  const { mutate: readNotification, isPending } = useReadNotification();

  const handleBack = () => {
    router.back();
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as NotificationTab);
  };

  const handleNotificationClick = (id: number, deepLink: string, isRead: boolean) => {
    // 읽지 않은 알림인 경우에만 요청 보내기
    if (!isRead) {
      readNotification(id);
    }

    // 딥링크가 있다면 페이지 이동
    if (deepLink) {
      const separator = deepLink.includes('?') ? '&' : '?';
      router.push(`${deepLink}${separator}from=notification`);
    }
  };

  const renderContent = () => {
    // 로딩 중일 때(임시)
    if (isLoading || isPending) {
      return <div className="p-20 text-center text-gray-500">로딩 중...</div>;
    }

    // 데이터가 없거나 비어있을 때 (탭 별 메시지 분기)
    if (!data || data.length === 0) {
      const emptyMessages = {
        ALL: '아직 새로운 알림이 없어요',
        ACTIVITY: '아직 새로운 활동 알림이 없어요.',
        SCHEDULE: '아직 새로운 일정 알림이 없어요.',
      };
      return (
        <div className="text-body-body8 text-foreground-tertiary flex h-full w-full flex-col items-center justify-center gap-[0.43rem] text-center">
          <NotificationEmpty className="h-[4.90913rem] w-[4.90913rem]" />
          {emptyMessages[currentTab]}
        </div>
      );
    }

    if (isPending) {
      return <div className="p-20 text-center text-gray-500">로딩 중...</div>;
    }

    // 데이터가 있을 때
    return <NotificationList items={data} onItemClick={handleNotificationClick} />;
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        customBack={handleBack}
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '알림',
          hasLeftIcon: true,
        }}
      />
      <Tab value={currentTab} onValueChange={handleTabChange} items={tabItems} />
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};
