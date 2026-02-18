import type { PresignedUrlResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function postPresignedUrl(fileNames: string[]): Promise<PresignedUrlResponse['data']> {
  try {
    const res = await axiosInstance.post<PresignedUrlResponse>('/v1/user/presigned-url', {
      fileNames,
    });
    return res.data.data;
  } catch (error) {
    console.error('Error fetching presigned URLs:', error);
    throw error;
  }
}
