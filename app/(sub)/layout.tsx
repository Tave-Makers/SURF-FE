import { AppHeader } from '@/widgets/header/ui/AppHeader';

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader />
      <section className="h-full w-full flex-1 overflow-auto">{children}</section>
    </div>
  );
}
