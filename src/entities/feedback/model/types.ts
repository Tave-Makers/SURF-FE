// 피드백 보내기 API 응답 타입
export type SubmitFeedBackApiResponse = {
  id: string;
  content: string;
  date: string;
};

// 피드백 보내기 API 요청 타입
export type SubmitFeedBackApiRequest = {
  content: string;
};
