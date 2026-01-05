import 'server-only';
import { getHome } from '@/entities/home/api/getHome.server';
import { buildHeroCardViewModel } from '@/features/home-theme/api/buildHeroCardViewModel.server';
import { HomePageClient } from './HomePageClient';

export async function HomePageServer() {
  const home = await getHome();
  const heroProps = await buildHeroCardViewModel(home);

  return <HomePageClient heroProps={heroProps} />;
}
