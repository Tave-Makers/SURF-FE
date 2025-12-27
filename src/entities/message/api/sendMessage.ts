import { axiosInstance } from '@/shared/lib/axiosInstance';

export type SendMessageRequest = {
  receiverId: number;
  title: string;
  content: string;
  sns?: string;
  replyEmail: string;
};

export const sendMessage = async (body: SendMessageRequest): Promise<void> => {
  const response = await axiosInstance.post('/v1/user/letters', body);

  console.log('쪽지 전송 성공 응답', response);
};
