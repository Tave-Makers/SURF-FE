import { HeaderMode } from '@surf/ui/header';
import HeaderLogo from '../../../../public/admin-header-logo.svg';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { AppNavigation } from '@/widgets/navigation/ui/AppNavigation';

export const HomePage = () => {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
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
