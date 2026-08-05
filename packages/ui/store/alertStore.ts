'use client';

import { create } from 'zustand';

export type BaseAction = {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  testId?: string;
};

export type SolidAction = BaseAction & {
  type: 'solid';
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
};

export type TextAction = BaseAction & {
  type: 'text';
  variant?: 'primary' | 'secondary' | 'warning';
};

export type AlertAction = SolidAction | TextAction;
export type AlertState = 'default' | 'error';

export type AlertPayload = {
  state?: AlertState;
  title: string;
  infoText?: string;
  actions: AlertAction[];
};

export type AlertCloseOptions = {
  /** 닫힐 때 직전 포커스 요소로 포커스를 복원할지 여부. 닫은 뒤 다른 페이지로 이동하는 경우 false로 넘겨 포커스 복원(및 모바일 키보드 재노출)을 건너뛴다. 기본값 true. */
  restoreFocus?: boolean;
};

type AlertStore = {
  current: (AlertPayload & { isOpen: true }) | null;
  shouldRestoreFocus: boolean;
  open: (payload: AlertPayload) => void;
  close: (options?: AlertCloseOptions) => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
  current: null,
  shouldRestoreFocus: true,
  open: (payload) => set({ current: { ...payload, isOpen: true }, shouldRestoreFocus: true }),
  close: (options) => set({ current: null, shouldRestoreFocus: options?.restoreFocus ?? true }),
}));
