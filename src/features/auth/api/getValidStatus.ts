import { axiosInstance } from '@/shared/lib/axiosInstance';
import { ValidStatusResponse } from './types';
import { handleApiError } from '@/shared/lib/handleApiError';

export const getValidStatus = async (): Promise<ValidStatusResponse> => {
  const endpoint = '/v1/members/valid-status';

  try {
    const { data } = await axiosInstance.get<ValidStatusResponse>(endpoint);
    return data;
  } catch (error) {
    throw handleApiError(error, endpoint);
  }
};
