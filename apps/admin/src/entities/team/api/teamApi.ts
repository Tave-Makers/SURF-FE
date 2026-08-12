import { axiosInstance } from '@/shared/lib/axiosInstance';
import type {
  TeamApiType,
  TeamDetailDto,
  TeamDetailResponse,
  TeamGenerationSectionDto,
  TeamListResponse,
} from './types';

export const teamApi = {
  /** 등록된 팀 목록을 기수 섹션 단위로 조회한다. type 미지정 시 전체. */
  getTeams: async (type?: TeamApiType): Promise<TeamGenerationSectionDto[]> => {
    const res = await axiosInstance.get<TeamListResponse>('/v1/admin/teams', {
      params: type ? { type } : undefined,
    });

    return res.data.data ?? [];
  },

  /** 팀 상세 — 팀원 목록(프로필/트랙 포함)을 함께 반환한다. */
  getTeamDetail: async (teamId: number): Promise<TeamDetailDto | null> => {
    const res = await axiosInstance.get<TeamDetailResponse>(`/v1/admin/teams/${teamId}`);

    return res.data.data;
  },
};
