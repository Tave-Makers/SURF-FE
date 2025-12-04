import { ImageItem } from '@/entities/post/api/types';

export type UpdatePostRequest = {
  title: string;
  content: string;
  categoryId?: number;
  pinned?: boolean;
  isReservationChanged?: boolean;
  reservedAt?: string | null;
  isImageChanged?: boolean;
  imageUrlList?: ImageItem[];
  hasSchedule?: boolean;
};
