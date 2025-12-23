'use client';

import { SolidButton } from '@/shared/ui/button/solid-button/SolidButton';
import * as amplitude from '@amplitude/analytics-browser';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/shared/store/toastStore';

import { useEffect } from 'react';
import { getFcmToken } from '@/shared/lib/fcm';
import { useRegisterToken } from '@/entities/notification/model/useRegisterToken';

const handleToast = () => {
  useToastStore.getState().show('성공');
};

export const HomePage = () => {
  const { mutate: registerToken } = useRegisterToken();

  useEffect(() => {
    const isRegistered = sessionStorage.getItem('isFcmRegistered');
    if (isRegistered) return;

    const handleFcmRegistration = async () => {
      try {
        const token = await getFcmToken();

        if (token) {
          registerToken({
            token: token,
            platform: 'WEB',
          });

          sessionStorage.setItem('isFcmRegistered', 'true');
        }
        console.log('홈 화면: FCM 토큰 등록 완료');
      } catch (error) {
        console.error('FCM 설정 실패:', error);
      }
    };

    void handleFcmRegistration();
  }, [registerToken]);

  const router = useRouter();

  const handleTestEvent = () => {
    amplitude.track('TEST_EVENT', {
      page: 'HomePage',
      clickedAt: new Date().toISOString(),
    });
    console.info('[Amplitude] TEST_EVENT 전송 완료');
  };

  const handleCalendarClick = () => {
    router.push('/home/calendar');
  };

  return (
    <div>
      <SolidButton size="s" variant="primary" onClick={handleTestEvent}>
        Amplitude 이벤트 테스트
      </SolidButton>

      <button className="bg-amber-300" onClick={handleCalendarClick}>
        캘린더 화면 보기 클릭!
      </button>

      <button onClick={handleToast}>토스트</button>
    </div>
  );
};
