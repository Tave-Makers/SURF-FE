import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function agreeTerms(): Promise<void> {
  await axiosInstance.patch('/v1/user/members/terms/agree');
}
