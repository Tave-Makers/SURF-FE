'use client';

import { createPortal } from 'react-dom';

import { useAlertStore } from '../../store/alertStore';
import { Alert } from './Alert';

export const AlertViewport = () => {
  const current = useAlertStore((s) => s.current);
  const close = useAlertStore((s) => s.close);

  if (typeof window === 'undefined') return null;
  if (!current) return null;

  const container = document.getElementById('alert-root') || document.body;

  return createPortal(
    <Alert
      state={current.state ?? 'default'}
      title={current.title}
      infoText={current.infoText}
      actions={current.actions}
      isOpen={true}
      onClose={close}
    />,
    container,
  );
};
