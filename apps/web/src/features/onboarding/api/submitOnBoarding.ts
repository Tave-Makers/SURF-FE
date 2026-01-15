import { handleApiError } from '@/shared/lib/handleApiError';
import { OnBoardingRequest, OnBoardingResponse } from '../model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function submitOnBoarding(data: OnBoardingRequest) {
  try {
    const res = await axiosInstance.post<OnBoardingResponse>('v1/user/members/signup', data);
    return res.data;
  } catch (error) {
    throw handleApiError(error, '회원가입에 실패했습니다.');
  }
}
