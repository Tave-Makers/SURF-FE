import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/navigation/ui/AppNavigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-full w-full flex-col">
        <AppHeader />
        <section className="flex-1">{children}</section>
        <AppNavigation />
      </div>
    </AuthProvider>
  );
}
