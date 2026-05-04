import { Badge } from '@/entities/badge/model/types';
import { BadgeResDto, CreateBadgeRequest } from '../api/types';
import { CreateBadgeInput } from './types';

export const mapBadgeResDtoToBadge = (dto: BadgeResDto): Badge => ({
  id: dto.badgeId,
  name: dto.name,
  imageUrl: dto.imageUrl,
});

export const mapCreateBadgeInputToRequest = (input: CreateBadgeInput): CreateBadgeRequest => ({
  name: input.name,
  imageUrl: input.imageUrl,
  description: 'description',
  requirement: 'requirement',
});
