'use client';

import { AppHeader } from '@/widgets/header/ui/AppHeader';

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-normal flex h-full w-full flex-col">
      <AppHeader />
      <main className="flex-1 px-[1rem]">{children}</main>
    </div>
  );
}
