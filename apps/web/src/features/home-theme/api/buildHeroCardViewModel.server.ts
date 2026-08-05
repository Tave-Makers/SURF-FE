import 'server-only';
import { getTheme } from './getTheme.server';
import type { ThemeItem } from './types';
import type { HomeApiResponseData } from '@/entities/home/api/types';
import { getCharacterKeyByPart, PART_LABEL } from '@/features/home-theme/model/mappers';
import type { HeroCardProps } from '@/features/home-theme/ui/hero-card/HeroCard';

export async function buildHeroCardViewModel(home: HomeApiResponseData): Promise<HeroCardProps> {
  const theme: ThemeItem = await getTheme();

  const characterKey = getCharacterKeyByPart(home.memberPart);

  const charImgUrl = theme[characterKey];
  if (typeof charImgUrl !== 'string' || !charImgUrl) {
    throw new Error(`Character image not found: ${characterKey}`);
  }

  const bgImgUrl = theme.background;
  if (typeof bgImgUrl !== 'string' || !bgImgUrl) {
    throw new Error('Theme background not found');
  }

  return {
    noticeData: {
      message: home.message ?? '',
      sender: home.sender ?? '',
    },
    userData: {
      name: home.memberName,
      batch: home.memberGeneration,
      part: PART_LABEL[home.memberPart] ?? home.memberPart,
    },
    imgData: {
      bgImgUrl,
      charImgUrl,
      isDark: !!theme.isBgDark,
    },
  };
}
