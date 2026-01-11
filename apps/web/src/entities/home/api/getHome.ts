import { HomeApiResponse, HomeApiResponseData } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getHome(): Promise<HomeApiResponseData> {
  try {
    const response = await axiosInstance.get<HomeApiResponse>('/v1/user/home', {});
    if (process.env.NODE_ENV === 'development') {
      console.log('홈 화면 데이터 불러오기 요청 성공', response.data);
    }
    return response.data.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('홈 화면 데이터 불러오기 요청 실패:', error);
    }
    throw error;
  }
}
