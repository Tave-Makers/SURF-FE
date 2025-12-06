import { PostCategoryKey } from '@/entities/post/model/category';
import { UploadImage } from '@/entities/image/model/types';

// 비교를 위한 스냅샷 타입
export type PostSnapshot = {
  title: string;
  category: PostCategoryKey;
  content: string;
  imageUrls: (string | null)[];
  reserved: boolean;
  reservedAt: Date | null;
};

// 에디터 내부 상태 타입
export type EditorState = {
  content: string;
  images: UploadImage[];
};

export type PostPageMode = 'create' | 'edit';
