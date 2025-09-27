import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

// hydration이 끝났는지 여부를 체크하는 훅
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useAuthStore.persist.hasHydrated());
    return unsub;
  }, []);

  return hydrated;
}
