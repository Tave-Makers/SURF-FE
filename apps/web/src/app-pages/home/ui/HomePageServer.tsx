import 'server-only';
import { HomePageClient } from './HomePageClient';
import { getHome } from '@/entities/home/api/getHome.server';
import { buildHeroCardViewModel } from '@/features/home-theme/api/buildHeroCardViewModel.server';

export async function HomePageServer() {
  try {
    const home = await getHome();
    const heroProps = await buildHeroCardViewModel(home);

    return <HomePageClient heroProps={heroProps} />;
  } catch (error) {
    console.error('[HomePageServer] Failed to load home data:', error);
    throw error;
  }
}
