import { HeaderMode } from '@surf/ui/header';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/navigation/ui/AppNavigation';
import HeaderLogo from 'public/admin-header-logo.svg';

export const HomePage = () => {
  return (
    <div className="w-full flex-1 flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Logo,
          logo: <HeaderLogo />,
        }}
      />
      <AppNavigation />
    </div>
  );
};
