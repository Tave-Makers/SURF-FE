'use client';

import { HeaderMode } from '@surf/ui/header';
import { Radio } from '@surf/ui/radio';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SettingsItem } from '@/entities/settings/ui/SettingsItem';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { THEME_OPTIONS } from '@/widgets/settings-list/model/constants';

export const ModePage = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <AppHeader
        overrideHeader={{
          title: '테마 변경',
          mode: HeaderMode.Default,
          hasLeftIcon: true,
        }}
      />

      {THEME_OPTIONS.map((option) => (
        <SettingsItem
          key={option.value}
          leftIconName={option.icon}
          rightContent={
            <div>
              <Radio
                id={option.value}
                name="mode"
                value={option.value}
                isChecked={theme === option.value}
                onChange={() => setTheme(option.value)}
              />
            </div>
          }
          onClick={() => setTheme(option.value)}
        >
          {option.label}
        </SettingsItem>
      ))}
    </div>
  );
};
