import { PostCategoryKey } from '@/entities/post/model/category';
import { UploadImage } from '@surf/utils';
import { ScheduleFormData } from '@/features/schedule/create/model/types';

export type PostPageMode = 'create' | 'edit';

export interface PostFormState {
  title: string;
  category: PostCategoryKey;
  content: string;
  images: UploadImage[];
  reserved: boolean;
  reservedAt: Date | null;
  initialSnapshot: PostSnapshot | null;
  isEditorInitialized: boolean;
  canInitialize: boolean;
  isInitialized: boolean;

  // Actions
  setField: <K extends keyof PostFormState>(field: K, value: PostFormState[K]) => void;
  setEditorState: (content: string, images: UploadImage[]) => void;
  setIsEditorInitialized: (isInit: boolean) => void;
  resetForm: () => void;
  setSnapshot: (snapshot: PostSnapshot) => void;
  setCanInitialize: (canInit: boolean) => void;
  setIsInitialized: (isInit: boolean) => void;
}

export type EditorState = Pick<PostFormState, 'content' | 'images'>;

export type PostSnapshot = Pick<
  PostFormState,
  'title' | 'category' | 'content' | 'reserved' | 'reservedAt'
> & {
  imageUrls: (string | null)[]; // UploadImage 객체 대신 URL 문자열 배열로 비교
  scheduleId: number | null; // 게시글 외적 요소이므로 별도 추가
  initialSchedule: ScheduleFormData | null;
};
