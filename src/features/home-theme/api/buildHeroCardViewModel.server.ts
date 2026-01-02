import 'server-only';
import type { ThemeItem } from './types';
import type { HomeApiResponseData } from '@/entities/home/api/types';
import { getCharacterKeyByPart, PART_LABEL } from '@/features/home-theme/model/mappers';

export async function buildHeroCardViewModel(home: HomeApiResponseData) {
  const { getTheme } = await import('./getTheme.server');
  const theme: ThemeItem = await getTheme();

  const characterKey = getCharacterKeyByPart(home.memberPart);

  const charImgUrl = theme[characterKey] as string | null;
  if (!charImgUrl) {
    throw new Error(`Character image not found: ${characterKey}`);
  }

  const bgImgUrl = theme.background as string | null;
  if (!bgImgUrl) {
    throw new Error('Theme background not found');
  }

  return {
    noticeData: {
      title: home.mainText,
      sender: home.sender ?? 'TAVE 운영진',
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
