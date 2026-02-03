import { axiosInstance } from '@/shared/lib/axiosInstance';
import { MemberInfoResponse } from './types';

export async function getMemberInfo(memberId: number): Promise<MemberInfoResponse> {
  const response = await axiosInstance.get<MemberInfoResponse>(`/v1/manager/member/${memberId}`);

  return response.data;
}
