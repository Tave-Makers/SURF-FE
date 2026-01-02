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

type AlertStore = {
  current: (AlertPayload & { isOpen: true }) | null;
  open: (payload: AlertPayload) => void;
  close: () => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
  current: null,
  open: (payload) => set({ current: { ...payload, isOpen: true } }),
  close: () => set({ current: null }),
}));
