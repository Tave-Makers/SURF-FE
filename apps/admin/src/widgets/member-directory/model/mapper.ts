import { AdminTotalMemberListResDTO } from '../api/types';
import { MemberGenerationList } from './types';

/**
 * API DTO -> 도메인 모델 변환
 */
export function toMemberGenerationList(dto: AdminTotalMemberListResDTO): MemberGenerationList {
  const picked = (dto?.generations ?? []).filter(
    (item): item is { generation: number } => typeof item?.generation === 'number',
  );

  //  number[]로 변환
  const generations = picked.map((item) => item.generation);

  return generations;
}
