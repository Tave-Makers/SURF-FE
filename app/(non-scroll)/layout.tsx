import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/navigation/ui/AppNavigation';

export default function NonScrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <AppHeader />
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</section>
      <AppNavigation />
    </div>
  );
}
