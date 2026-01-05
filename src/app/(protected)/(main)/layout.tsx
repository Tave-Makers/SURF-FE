import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/bottom-navigation/ui/AppNavigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col">
      <AppHeader />
      <section className="flex min-h-0 flex-1 flex-col">{children}</section>
      <AppNavigation />
    </div>
  );
}
