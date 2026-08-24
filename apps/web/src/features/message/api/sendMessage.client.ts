import { axiosInstance } from '@/shared/lib/axiosInstance';

export type SendMessageRequest = {
  receiverId: number;
  title: string;
  content: string;
  sns?: string;
  replyEmail: string;
};

export const sendMessage = async (body: SendMessageRequest): Promise<void> => {
  await axiosInstance.post('/v1/user/letters', body);
};
