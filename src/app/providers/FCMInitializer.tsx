'use client';

import { useEffect } from 'react';
import { getFcmToken } from '@/shared/lib/fcm';

export default function FCMInitializer() {
  useEffect(() => {
    async function init() {
      try {
        const token = await getFcmToken();
        if (token) {
          if (process.env.NODE_ENV === 'development') {
            console.log('FCM Initialized with token:', token);
          }
        }
      } catch (error) {
        console.error('FCM Initialization failed:', error);
      }
    }

    void init();
  }, []);

  return null;
}
