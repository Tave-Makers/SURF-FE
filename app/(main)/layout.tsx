'use client';

import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/navigation/ui/AppNavigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-normal flex h-full w-full flex-col">
      <AppHeader />
      <main className="flex-1 px-[1rem]">{children}</main>
      <AppNavigation />
    </div>
  );
}
