import { useEffect } from 'react';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { PostFormState, PostPageMode } from '@/features/post/post-form/model/types';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { PostDetail } from '@/entities/post/model/types';
import { PostScheduleData } from '@/entities/post/api/types';
import { UploadImage } from '@surf/utils';
import { usePostFormStore } from './usePostFormStore';

type PostFormActions = Pick<PostFormState, 'setField'>;

interface Props extends PostFormActions {
  mode: PostPageMode;
  postDetail: PostDetail | undefined;
  postSchedule: PostScheduleData | undefined;
  isPostDetailLoading: boolean;
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (data: ScheduleFormData) => void;
  isScheduleLoading: boolean;
}

export const usePostInitialization = ({
  mode,
  postDetail,
  postSchedule,
  isPostDetailLoading,
  linkedSchedule,
  setField,
  setLinkedSchedule,
  isScheduleLoading,
}: Props) => {
  const { isInitialized, setIsInitialized, setSnapshot } = usePostFormStore();

  useEffect(() => {
    // 1. 초기화 가드
    if (isInitialized) return;
    // 데이터 로딩 대기
    if (mode === 'edit' && isPostDetailLoading) return;
    if (postDetail?.hasSchedule && isScheduleLoading) return;

    // 2. 데이터 매핑

    // 카테고리 매핑
    const matchedEntry = Object.entries(POST_CATEGORIES).find(
      ([_, value]) => value.label === postDetail?.categoryLabel,
    );
    const initialCategory = matchedEntry ? (matchedEntry[0] as PostCategoryKey) : 'event';

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

    // 3. 상태 주입
    const contentValue = postDetail?.content ?? '';

    setField('title', postDetail?.title ?? '');
    setField('content', contentValue);
    setField('images', mappedImages);
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
      reserved: initialReserved,
      reservedAt: initialReservedAt,
      scheduleId: postSchedule?.scheduleId ?? null,
      initialSchedule: initialScheduleData,
    });

    setIsInitialized(true);
  }, [
    mode,
    postDetail,
    postSchedule,
    setSnapshot,
    setField,
    setLinkedSchedule,
    isInitialized,
    linkedSchedule,
    isPostDetailLoading,
    isScheduleLoading,
  ]);
};
