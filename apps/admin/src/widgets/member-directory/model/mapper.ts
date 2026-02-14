import { AdminTotalMemberListResDTO } from '../api/types';
import { MemberDirectoryInfo } from './types';

/**
 * API DTO -> 도메인 모델 변환
 */
export function toMemberGenerationList(dto: AdminTotalMemberListResDTO): MemberDirectoryInfo {
  const picked = (dto?.generations ?? []).filter(
    (item): item is { generation: number } => typeof item?.generation === 'number',
  );

  //  number[]로 변환
  const generations = picked.map((item) => item.generation);

  if (process.env.NODE_ENV !== 'production') {
    const dropped = (dto.generations?.length ?? 0) - generations.length;
    if (dto.totalMemberCount === undefined || dropped > 0) {
      console.warn('[member-directory] unexpected DTO shape', dto);
    }
  }

  return {
    totalMemberCount: dto.totalMemberCount ?? 0,
    generations,
  };
}
