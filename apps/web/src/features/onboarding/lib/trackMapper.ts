import { toEnumPartMap, toLabelPartMap } from '@/entities/user/model/mappers';
import { TrackPart } from '@/entities/user/model/types';

export function mapToApiTrack(period: string, part: string) {
  const generation = Number(period.replace('기', ''));
  const mappedPart = (toEnumPartMap as Record<string, TrackPart | undefined>)[part];

  if (typeof mappedPart === 'undefined') {
    throw new Error(`지원하지 않는 part 값입니다: ${part}`);
  }

  return {
    generation,
    part: mappedPart,
  };
}

export function formatTrackLabel(generation: number | null, part: TrackPart | null) {
  if (!generation || !part) return '';
  return `${generation}기 ${toLabelPartMap[part]}`;
}
