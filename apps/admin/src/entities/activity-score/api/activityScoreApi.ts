import type { AxiosResponse } from 'axios';
import type { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { handleApiError } from '@/shared/lib/handleApiError';
import type {
  ActivityRecordPageDto,
  ActivityTypesResponse,
  CreateActivityRecordRequest,
  MemberScoreRankingResponse,
  ScoreRankingPageDto,
  MemberScoreRankingItemDto,
  MemberActivityRecordsResponse,
  TeamMemberScoresDto,
  TeamMemberScoresResponse,
  ActivityTypeGroupDto,
} from './types';

const SUCCESS_CODES = new Set([0, 200]);

type RankingParams = {
  pageNum: number;
  pageSize: number;
};

type MemberActivityRecordsParams = RankingParams & {
  scoreType: 'REWARD' | 'PENALTY';
};

const requestActivityScore = async <T>(
  request: () => Promise<AxiosResponse<CommonResponse<T | null>>>,
  fallbackMessage: string,
): Promise<T> => {
  const res = await request().catch((error) => {
    throw handleApiError(error, fallbackMessage);
  });
  const body = res.data;

  if (!SUCCESS_CODES.has(body.code) || body.data == null) {
    throw new Error(body.message || fallbackMessage);
  }

  return body.data;
};

const requestActivityScoreCommand = async (
  request: () => Promise<AxiosResponse<CommonResponse<unknown>>>,
  fallbackMessage: string,
): Promise<void> => {
  const res = await request().catch((error) => {
    throw handleApiError(error, fallbackMessage);
  });
  const body = res.data;

  if (!SUCCESS_CODES.has(body.code)) {
    throw new Error(body.message || fallbackMessage);
  }
};

export const activityScoreApi = {
  getMemberScoreRanking: async (
    params: RankingParams,
  ): Promise<ScoreRankingPageDto<MemberScoreRankingItemDto>> => {
    return requestActivityScore(
      () =>
        axiosInstance.get<MemberScoreRankingResponse>('/v1/admin/scores/members', {
          params,
        }),
      '개인별 점수 현황을 불러오지 못했습니다.',
    );
  },

  getTeamMemberScores: async (teamId: number): Promise<TeamMemberScoresDto> => {
    return requestActivityScore(
      () => axiosInstance.get<TeamMemberScoresResponse>(`/v1/admin/scores/teams/${teamId}/members`),
      '팀원 점수를 불러오지 못했습니다.',
    );
  },

  getActivityTypes: async (): Promise<ActivityTypeGroupDto[]> => {
    return requestActivityScore(
      () => axiosInstance.get<ActivityTypesResponse>('/v1/manager/activity-types'),
      '활동 종류를 불러오지 못했습니다.',
    );
  },

  getMemberActivityRecords: async (
    memberId: number,
    params: MemberActivityRecordsParams,
  ): Promise<ActivityRecordPageDto> => {
    return requestActivityScore(
      () =>
        axiosInstance.get<MemberActivityRecordsResponse>(
          `/v1/admin/scores/members/${memberId}/activity-records`,
          { params },
        ),
      '회원 활동기록을 불러오지 못했습니다.',
    );
  },

  createActivityRecord: async (body: CreateActivityRecordRequest): Promise<void> => {
    return requestActivityScoreCommand(
      () => axiosInstance.post<CommonResponse<unknown>>('/v1/admin/activity-records', body),
      '활동 점수를 부여하지 못했습니다.',
    );
  },

  deleteActivityRecord: async (activityRecordId: number): Promise<void> => {
    return requestActivityScoreCommand(
      () =>
        axiosInstance.delete<CommonResponse<unknown>>(
          `/v1/admin/activity-records/${activityRecordId}`,
        ),
      '활동기록을 삭제하지 못했습니다.',
    );
  },
};
