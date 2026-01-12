import { AppHeader } from '@/widgets/header/ui/AppHeader';

const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader />
      <section className="h-full w-full flex-1 overflow-hidden">{children}</section>
    </div>
  );
};

export default SubLayout;
