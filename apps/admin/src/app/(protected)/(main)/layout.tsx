import { AppHeader } from "@/widgets/header/ui/AppHeader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col">
      <AppHeader />
      <section className="flex min-h-0 flex-1 flex-col">{children}</section>
    </div>
  );
};

export default MainLayout;
