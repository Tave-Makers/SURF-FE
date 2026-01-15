import { axiosInstance } from '../../../shared/lib/axiosInstance';
import { SubmitFeedbackApiRequest, SubmitFeedbackApiResponse } from './types';

// 피드백 보내기 요청
export const postFeedback = async (
  content: SubmitFeedbackApiRequest,
): Promise<SubmitFeedbackApiResponse> => {
  try {
    const response = await axiosInstance.post<SubmitFeedbackApiResponse>(
      `/v1/user/feedbacks`,
      content,
    );
    return response.data;
  } catch (error) {
    console.error('[피드백 보내기 요청 실패]:', error);
    throw error;
  }
};
