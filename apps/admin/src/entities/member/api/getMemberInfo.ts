import { MemberInfoResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getMemberInfo(memberId: number): Promise<MemberInfoResponse> {
  const response = await axiosInstance.get<MemberInfoResponse>(`/v1/manager/member/${memberId}`);

  return response.data;
}
