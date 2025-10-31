'use client';
import { useState } from 'react';

export function useSelectSheet<T = string>() {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);

  const open = () => setOpen(true);
  const close = () => setOpen(false);
  const select = (value: T) => {
    setSelected(value);
    close();
  };

  return { isOpen, selected, open, close, select };
}
