import { UploadFile, UploadImage } from '@surf/utils';
import { PostCategoryKey } from '@/entities/post/model/category';
import { ScheduleFormData } from '@/features/schedule/create/model/types';

export type PostPageMode = 'create' | 'edit';

export interface PostFormState {
  postId: string;
  title: string;
  category: PostCategoryKey;
  content: string;
  images: UploadImage[];
  files: UploadFile[];
  reserved: boolean;
  reservedAt: Date | null;
  initialSnapshot: PostSnapshot | null;
  isInitialized: boolean;

  // Actions
  setField: <K extends keyof PostFormState>(field: K, value: PostFormState[K]) => void;
  resetForm: () => void;
  setSnapshot: (snapshot: PostSnapshot) => void;
  setIsInitialized: (isInit: boolean) => void;
}

export type PostSnapshot = Pick<
  PostFormState,
  'title' | 'category' | 'content' | 'reserved' | 'reservedAt'
> & {
  imageUrls: (string | null)[];
  fileUrls: string[];
  scheduleId: number | null;
  initialSchedule: ScheduleFormData | null;
};
