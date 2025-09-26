import { AppHeader } from '@/widgets/header/ui/AppHeader';

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader />
      <section className="flex-1 px-[1rem]">{children}</section>
    </div>
  );
}
