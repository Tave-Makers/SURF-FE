import { FileItem, ImageItem } from '@/entities/post/api/types';

export type CreatePostRequest = {
  boardId: number;
  categoryId: number;
  title: string;
  content: string;
  pinned?: boolean;
  reservedAt?: string | null;
  imageUrlList?: ImageItem[];
  fileList?: FileItem[];
  hasSchedule?: boolean;
  reserved?: boolean;
};
