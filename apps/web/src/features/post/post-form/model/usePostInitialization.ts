import { useEffect } from 'react';
import { getCategoriesForBoard } from '@/entities/post/model/category';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { PostFormState, PostPageMode } from '@/features/post/post-form/model/types';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { PostDetail } from '@/entities/post/model/types';
import { PostScheduleData } from '@/entities/post/api/types';
import { UploadFile, UploadImage } from '@surf/utils';
import { usePostFormStore } from './usePostFormStore';

type PostFormActions = Pick<PostFormState, 'setField'>;

interface Props extends PostFormActions {
  mode: PostPageMode;
  boardId: string;
  postId: string | undefined;
  postDetail: PostDetail | undefined;
  postSchedule: PostScheduleData | undefined;
  isPostDetailLoading: boolean;
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (data: ScheduleFormData) => void;
  isScheduleLoading: boolean;
  resetPostState: () => void;
}

export const usePostInitialization = ({
  mode,
  boardId,
  postId,
  postDetail,
  postSchedule,
  isPostDetailLoading,
  linkedSchedule,
  setField,
  setLinkedSchedule,
  isScheduleLoading,
  resetPostState,
}: Props) => {
  const { postId: storedPostId, isInitialized, setIsInitialized, setSnapshot } = usePostFormStore();

  useEffect(() => {
    // 1. 초기화 가드
    const currentId = mode === 'edit' ? postId : 'create';

    // 다른 게시글 데이터가 남아있으면 리셋
    if (isInitialized && storedPostId !== currentId) {
      resetPostState();
      return;
    }

    if (isInitialized) return;
    // 데이터 로딩 대기
    if (mode === 'edit' && isPostDetailLoading) return;
    if (postDetail?.hasSchedule && isScheduleLoading) return;

    // 2. 데이터 매핑

    // 카테고리 매핑
    const boardCats = getCategoriesForBoard(Number(boardId));
    const matched = boardCats.find((c) => c.label === postDetail?.categoryLabel);
    const initialCategory = matched?.key ?? boardCats[0].key;

    // 예약 정보 계산
    let initialReserved = false;
    let initialReservedAt: Date | null = null;
    if (postDetail?.isReserved && postDetail?.reservedAt) {
      initialReserved = true;
      initialReservedAt = new Date(postDetail.reservedAt);
    }

    // 일정 정보 매핑
    let initialScheduleData: ScheduleFormData | null = null;
    if (postSchedule) {
      const mappedCategory =
        postSchedule.category === 'operation' || postSchedule.category === 'other'
          ? postSchedule.category
          : 'regular';

      initialScheduleData = {
        id: postSchedule.scheduleId,
        title: postSchedule.title,
        startDate: new Date(postSchedule.startAt),
        endDate: new Date(postSchedule.endAt),
        location: postSchedule.location ?? '미정',
        category: mappedCategory as ScheduleCategory,
      };
    }

    // 이미지 리스트 매핑
    const mappedImages: UploadImage[] = (postDetail?.imageUrlList || [])
      .sort((a, b) => a.sequence - b.sequence)
      .map((img) => ({
        id: img.originalUrl,
        preview: img.originalUrl,
        status: 'uploaded' as const,
        uploadedUrl: img.originalUrl,
        file: null,
      }));

    // 파일 리스트 매핑
    const mappedFiles: UploadFile[] = (postDetail?.fileList || [])
      .sort((a, b) => a.sequence - b.sequence)
      .map((file) => ({
        id: String(file.fileId),
        file: null,
        originalFileName: file.originalFileName,
        fileSize: 0,
        status: 'uploaded' as const,
        uploadedUrl: file.fileUrl,
      }));

    // 3. 상태 주입
    const contentValue = postDetail?.content ?? '';

    setField('title', postDetail?.title ?? '');
    setField('content', contentValue);
    setField('images', mappedImages);
    setField('files', mappedFiles);
    setField('category', initialCategory);
    setField('reserved', initialReserved);
    setField('reservedAt', initialReservedAt);

    if (initialScheduleData && !linkedSchedule) {
      setLinkedSchedule(initialScheduleData);
    }

    // 4. 완료 및 스냅샷 저장
    setSnapshot({
      title: postDetail?.title ?? '',
      category: initialCategory,
      content: contentValue,
      imageUrls: mappedImages.map((img) => img.uploadedUrl!),
      fileUrls: mappedFiles.map((f) => f.uploadedUrl!),
      reserved: initialReserved,
      reservedAt: initialReservedAt,
      scheduleId: postSchedule?.scheduleId ?? null,
      initialSchedule: initialScheduleData,
    });

    setField('postId', currentId!);
    setIsInitialized(true);
  }, [
    mode,
    postId,
    postDetail,
    postSchedule,
    setSnapshot,
    setField,
    setLinkedSchedule,
    isInitialized,
    storedPostId,
    resetPostState,
    setIsInitialized,
    linkedSchedule,
    isPostDetailLoading,
    isScheduleLoading,
    boardId,
  ]);
};
