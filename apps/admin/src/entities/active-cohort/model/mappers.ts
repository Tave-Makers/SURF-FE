import type { ActiveGenerationData } from '../api/types';
import type { ActiveCohort } from './types';

export function toActiveCohort(dto: ActiveGenerationData): ActiveCohort {
  return {
    generation: dto.activeGeneration,
  };
}
