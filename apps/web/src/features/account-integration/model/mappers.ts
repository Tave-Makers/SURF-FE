import { isTrackPart, toLabelPartMap } from '@/entities/user/model/mappers';
import type { IntegrationTargetResDTO, TrackResDTO } from '../api/types';
import type { IntegrationTarget } from './types';

function toChip({ generation, part }: TrackResDTO) {
  const partLabel = isTrackPart(part) ? toLabelPartMap[part] : part;
  return `${generation}기 ${partLabel}`;
}

export function mapIntegrationTarget(dto: IntegrationTargetResDTO): IntegrationTarget {
  return {
    username: dto.username,
    profileImageUrl: dto.profileImageUrl,
    selfIntroduction: dto.selfIntroduction,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
    providers: dto.providers ?? [],
    chips: dto.trackList.map(toChip),
  };
}
