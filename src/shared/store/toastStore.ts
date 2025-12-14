import { create } from 'zustand';

type ToastData = {
  id: string;
  text: string;
};

interface ToastStore {
  current: ToastData | null;
  show: (text: string) => void;
  clear: (id: string) => void;
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastStore>((set) => ({
  current: null,
  show: (text, durationMs = 3000) => {
    // 이미 걸려있는 타이머가 있으면 취소 (시간 카운트 리셋)
    if (hideTimer) clearTimeout(hideTimer);

    //current만 교체
    const id = crypto.randomUUID();
    set({ current: { id, text } });

    hideTimer = setTimeout(() => {
      // 타이머 끝나면 제거
      set({ current: null });
      hideTimer = null;
    }, durationMs);
  },

  clear: () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
    set({ current: null });
  },
}));
