import { useEffect } from 'react';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { isSameSchedule } from '@/features/schedule/lib/scheduleUtils';
import { PostPageMode, PostSnapshot } from '@/features/post/post-form/model/types';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { PostDetail } from '@/entities/post/model/types';
import { PostScheduleData } from '@/entities/post/api/types';

// 필요한 타입 정의 (너무 길면 별도 interface로 분리)
type Props = {
  mode: PostPageMode;
  postDetail: PostDetail | undefined;
  postSchedule: PostScheduleData | undefined;
  linkedSchedule: ScheduleFormData | null;
  setLinkedSchedule: (data: ScheduleFormData) => void;
  setTitle: (title: string) => void;
  selectCategory: (key: PostCategoryKey) => void;
  setReserved: (val: boolean) => void;
  setReservedAt: (date: Date | null) => void;
  initialSnapshot: React.MutableRefObject<
    PostSnapshot & { initialSchedule: ScheduleFormData | null }
  >;
  isScheduleInitializedRef: React.MutableRefObject<boolean>;
};

export const usePostInitialization = ({
  mode,
  postDetail,
  postSchedule,
  linkedSchedule,
  setLinkedSchedule,
  setTitle,
  selectCategory,
  setReserved,
  setReservedAt,
  initialSnapshot,
  isScheduleInitializedRef,
}: Props) => {
  useEffect(() => {
    // 1. 가드 절
    if (mode === 'create' || isScheduleInitializedRef.current) return;

    // 이미 스토어에 데이터가 있으면(수정 후 복귀) 초기화 건너뜀
    if (linkedSchedule) {
      isScheduleInitializedRef.current = true;
      return;
    }

    if (mode === 'edit' && postDetail) {
      // 2. 기본 정보 초기화
      setTitle(postDetail.title);
      const matchedEntry = Object.entries(POST_CATEGORIES).find(
        ([_, value]) => value.label === postDetail.categoryLabel,
      );
      const initialCategory = matchedEntry ? (matchedEntry[0] as PostCategoryKey) : 'event';
      selectCategory(initialCategory);

      // 3. 예약 정보 초기화
      let initialReserved = false;
      let initialReservedAt: Date | null = null;
      if (postDetail.postedAt) {
        const postedDate = new Date(postDetail.postedAt);
        if (postedDate > new Date()) {
          initialReserved = true;
          initialReservedAt = postedDate;
        }
      }
      setReserved(initialReserved);
      setReservedAt(initialReservedAt);

      // 4. 일정 정보 초기화
      let initialScheduleData: ScheduleFormData | null = null;

      if (postSchedule) {
        const mappedCategory =
          postSchedule.category === 'operation' || postSchedule.category === 'other'
            ? postSchedule.category
            : 'regular';

        const newScheduleData = {
          id: postSchedule.scheduleId,
          title: postSchedule.title,
          startDate: new Date(postSchedule.startAt),
          endDate: new Date(postSchedule.endAt),
          location: postSchedule.location ?? '미정',
          category: mappedCategory as ScheduleCategory,
        };

        initialScheduleData = newScheduleData;

        // 동기화 필요 여부 확인 (유틸 사용)
        const shouldSyncStore = !isSameSchedule(linkedSchedule, newScheduleData);
        if (shouldSyncStore) {
          console.log('초기 데이터 동기화 수행');
          setLinkedSchedule(newScheduleData);
          isScheduleInitializedRef.current = true;
        }
      }

      // 5. 스냅샷 저장
      initialSnapshot.current = {
        title: postDetail.title,
        category: initialCategory,
        content: postDetail.content ?? '',
        imageUrls: (postDetail.imageUrlList || [])
          .sort((a, b) => a.sequence - b.sequence)
          .map((img) => img.originalUrl),
        reserved: initialReserved,
        reservedAt: initialReservedAt,
        scheduleId: postSchedule?.scheduleId ?? null,
        initialSchedule: initialScheduleData,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    postDetail,
    postSchedule,
    linkedSchedule,
    // 의존성 배열에 Setter들은 안전하므로 생략 가능하지만, 명시해도 됨
    setLinkedSchedule,
    setTitle,
    selectCategory,
    setReserved,
    setReservedAt,
    // Ref는 의존성 배열에 넣지 않아도 됨
  ]);
};
