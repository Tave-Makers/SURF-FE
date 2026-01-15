import { create } from 'zustand';

type TooltipStore = {
  activeId: string | null;
  timerId: ReturnType<typeof setTimeout> | null;
  show: (id: string, duration?: number) => void;
  hide: () => void;
};

export const useTooltipStore = create<TooltipStore>((set, get) => ({
  activeId: null,
  timerId: null,
  show: (id, duration = 1500) => {
    // 기존 타이머 정리
    const prevTimer = get().timerId;
    if (prevTimer) clearTimeout(prevTimer);

    // 새 툴팁 표시
    set({ activeId: id });

    // 새 타이머 등록
    const timer = setTimeout(() => set({ activeId: null, timerId: null }), duration);
    set({ timerId: timer });
  },
  hide: () => {
    const prevTimer = get().timerId;
    if (prevTimer) clearTimeout(prevTimer);
    set({ activeId: null, timerId: null });
  },
}));
