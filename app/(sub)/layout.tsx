import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { QueryProvider } from '@/app/providers/QueryProvider';

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex h-full w-full flex-col">
        <AppHeader />
        <section className="flex-1">{children}</section>
      </div>
    </QueryProvider>
  );
}
