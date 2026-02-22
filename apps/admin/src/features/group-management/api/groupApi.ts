import {
  CreateGroupRequest,
  CreateGroupResDto,
  CreateGroupResponse,
  GroupApiType,
  GroupGenerationResDto,
  GroupGenerationListResponse,
  GroupDetailResDto,
  GroupDetailResponse,
} from '@/features/group-management/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export const groupApi = {
  createGroup: async (body: CreateGroupRequest): Promise<CreateGroupResDto> => {
    const res = await axiosInstance.post<CreateGroupResponse>('/v1/admin/teams', body);
    return res.data.data;
  },
  getGroupList: async (params: { type: GroupApiType }): Promise<GroupGenerationResDto[]> => {
    const res = await axiosInstance.get<GroupGenerationListResponse>('/v1/admin/teams', { params });
  getGroupDetail: async (params: { teamId: number }): Promise<GroupDetailResDto> => {
    const { teamId } = params;
    const res = await axiosInstance.get<GroupDetailResponse>(`/v1/admin/teams/${teamId}`);
    return res.data.data;
  },
  updateGroup: () => {},
  deleteGroup: () => {},
};
