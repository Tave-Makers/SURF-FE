import { useEffect } from 'react';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { PostFormState, PostPageMode } from '@/features/post/post-form/model/types';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { PostDetail } from '@/entities/post/model/types';
import { PostScheduleData } from '@/entities/post/api/types';
import { UploadImage } from '@/entities/image/model/types';
import { usePostFormStore } from './usePostFormStore';

type PostFormActions = Pick<PostFormState, 'setField' | 'setEditorState'>;

interface Props extends PostFormActions {
  mode: PostPageMode;
  postDetail: PostDetail | undefined;
  postSchedule: PostScheduleData | undefined;
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (data: ScheduleFormData) => void;
  isInitializedRef: React.RefObject<boolean>;
  isScheduleFetching: boolean;
}

export const usePostInitialization = ({
  mode,
  postDetail,
  postSchedule,
  linkedSchedule,
  setField,
  setEditorState,
  setLinkedSchedule,
  isInitializedRef,
  isScheduleFetching,
}: Props) => {
  const { initialSnapshot, setSnapshot, content, images, canInitialize } = usePostFormStore();

  useEffect(() => {
    // 1. 초기화 가드
    if (!canInitialize) return;
    if (mode === 'create' || isInitializedRef.current) return;
    if (mode === 'edit' && !postDetail) return;
    // 일정이 있는 게시글인데, 일정을 아직 가져오지 못했거나 '새로 가져오는 중(Fetching)'이면 대기
    if (postDetail?.hasSchedule && (postSchedule === undefined || isScheduleFetching)) {
      return;
    }

    // 이미 스냅샷이 있는 경우 (뒤로가기 등 세션 유지 상황)
    if (initialSnapshot) {
      setEditorState(content, images);
      isInitializedRef.current = true;
      return;
    }

    // 게시글에 연동된 일정이 있으나, 일정 데이터가 아직 로딩 중인 경우 대기
    if (postDetail?.hasSchedule && postSchedule === undefined) {
      return;
    }

    // 2. 데이터 매핑

    // 카테고리 매핑
    const matchedEntry = Object.entries(POST_CATEGORIES).find(
      ([_, value]) => value.label === postDetail?.categoryLabel,
    );
    const initialCategory = matchedEntry ? (matchedEntry[0] as PostCategoryKey) : 'event';

    // 예약 정보 계산
    let initialReserved = false;
    let initialReservedAt: Date | null = null;
    if (postDetail?.postedAt) {
      const postedDate = new Date(postDetail.postedAt);
      if (postedDate > new Date()) {
        initialReserved = true;
        initialReservedAt = postedDate;
      }
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
    setField('category', initialCategory);
    setField('reserved', initialReserved);
    setField('reservedAt', initialReservedAt);

    if (initialScheduleData && !linkedSchedule) {
      setLinkedSchedule(initialScheduleData);
    }

    // 에디터 엔진에 데이터 주입
    setEditorState(contentValue, mappedImages);

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

    isInitializedRef.current = true;
  }, [
    mode,
    postDetail,
    postSchedule,
    initialSnapshot,
    setSnapshot,
    setField,
    setEditorState,
    setLinkedSchedule,
    isInitializedRef,
    linkedSchedule,
    content,
    images,
    isScheduleFetching,
    canInitialize,
  ]);
};
