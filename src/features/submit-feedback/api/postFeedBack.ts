import { axiosInstance } from '../../../shared/lib/axiosInstance';
import {
  SubmitFeedBackApiRequest,
  SubmitFeedBackApiResponse,
} from '../../../entities/feedback/model/types';

// 피드백 보내기 요청
export const postFeedBack = async (
  content: SubmitFeedBackApiRequest,
): Promise<SubmitFeedBackApiResponse> => {
  const response = await axiosInstance.post<SubmitFeedBackApiResponse>(`/v1/feedbacks`, content);
  return response.data;
};
