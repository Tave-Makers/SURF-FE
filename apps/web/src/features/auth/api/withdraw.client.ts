import { axiosInstance } from '@/shared/lib/axiosInstance';
export async function withdraw(): Promise<void> {
  await axiosInstance.post('/v1/user/members/withdraw');
}
