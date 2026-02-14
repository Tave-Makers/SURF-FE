import { AdminTotalMemberListResDTO } from '../api/types';
import { MemberDirectoryInfo } from './types';

/**
 * API DTO -> 도메인 모델 변환
 */
export function toMemberGenerationList(dto: AdminTotalMemberListResDTO): MemberDirectoryInfo {
  const generations = (dto.generations ?? []).filter(
    (item): item is { generation: number; name: string } =>
      item.generation !== undefined && item.name !== undefined,
  );

  if (process.env.NODE_ENV !== 'production') {
    const dropped = (dto.generations?.length ?? 0) - generations.length;
    if (dto.totalMemberCount === undefined || dropped > 0) {
      console.warn('[member-directory] unexpected DTO shape', dto);
    }
  }

  return {
    totalMemberCount: dto.totalMemberCount ?? 0,
    generations: generations.map((item) => ({
      generation: item.generation,
      label: item.name,
    })),
  };
}
