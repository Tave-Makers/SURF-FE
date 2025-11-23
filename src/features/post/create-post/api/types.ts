import { ImageItem } from '@/entities/post/api/types';

export type CreatePostRequest = {
  boardId: number;
  categoryId: number;
  title: string;
  content: string;
  pinned: boolean;
  reservedAt?: string;
  imageUrlList?: ImageItem[];
  reserved: boolean;
};
