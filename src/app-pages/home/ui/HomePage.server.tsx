import { getHome } from '@/entities/home/api/getHome.server';
import { buildHeroCardViewModel } from '@/features/home-theme/api/buildHeroCardViewModel.server';
import { HomePageClient } from './HomePageClient';
import type { HeroCardProps } from '@/features/home-theme/ui/hero-card/HeroCard';

export async function HomePage() {
  const home = await getHome();
  const heroProps: HeroCardProps = await buildHeroCardViewModel(home);

  return <HomePageClient heroProps={heroProps} />;
}
