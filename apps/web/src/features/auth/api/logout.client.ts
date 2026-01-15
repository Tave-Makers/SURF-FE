import { axiosInstance } from '@/shared/lib/axiosInstance';
export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout');
}
