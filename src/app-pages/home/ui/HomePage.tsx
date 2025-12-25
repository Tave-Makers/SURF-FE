'use client';

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
        }
      } catch (error) {
        console.error('FCM 설정 실패:', error);
      }
    };

    void handleFcmRegistration();
  }, [registerToken]);

  return (
    <div>
      <button onClick={handleToast}>토스트</button>
    </div>
  );
};
