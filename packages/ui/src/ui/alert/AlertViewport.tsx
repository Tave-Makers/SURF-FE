'use client';

import { createPortal } from 'react-dom';

import { Alert } from './Alert';
import { useAlertStore } from '../../store/alertStore';

export default function AlertViewport() {
  const current = useAlertStore((s) => s.current);
  const close = useAlertStore((s) => s.close);

  if (typeof window === 'undefined') return null;
  if (!current) return null;

  return createPortal(
    <Alert
      state={current.state ?? 'default'}
      title={current.title}
      infoText={current.infoText}
      actions={current.actions}
      isOpen={true}
      onClose={close}
    />,
    document.body,
  );
}
