'use client';

import { useMemo, useState } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

type Preset = '7d' | '30d' | 'month' | 'custom';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getPresetRange(preset: Exclude<Preset, 'custom'>) {
  const today = new Date();

  if (preset === 'month') {
    return {
      startDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      endDate: formatDate(today),
    };
  }

  const days = preset === '7d' ? 6 : 29;

  return {
    startDate: formatDate(new Date(today.getTime() - days * DAY_MS)),
    endDate: formatDate(today),
  };
}

export function useDashboardDateRange() {
  const [preset, setPreset] = useState<Preset>('30d');
  const [customRange, setCustomRange] = useState(getPresetRange('30d'));

  const range = useMemo(
    () => (preset === 'custom' ? customRange : getPresetRange(preset)),
    [customRange, preset],
  );

  return {
    preset,
    range,
    customRange,
    setPreset,
    setCustomRange,
  };
}
