import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/navigation/ui/AppNavigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader />
      <section className="flex-1">{children}</section>
      <AppNavigation />
    </div>
  );
}
