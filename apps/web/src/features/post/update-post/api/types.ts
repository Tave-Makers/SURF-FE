import { FileItem, ImageItem } from '@/entities/post/api/types';

export type UpdatePostRequest = {
  title: string;
  content: string;
  categoryId?: number;
  pinned?: boolean;
  isReservationChanged?: boolean;
  reservedAt?: string | null;
  isContentChanged?: boolean;
  isImageChanged?: boolean;
  imageUrlList?: ImageItem[];
  isFileChanged?: boolean;
  fileList?: FileItem[];
  hasSchedule?: boolean;
};
