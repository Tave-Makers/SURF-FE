import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/navigation/ui/AppNavigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="flex h-full w-full flex-col">
          <AppHeader />
          <section className="flex-1 overflow-auto">{children}</section>
          <AppNavigation />
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}
