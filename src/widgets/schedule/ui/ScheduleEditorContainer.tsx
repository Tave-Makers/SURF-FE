'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { format } from 'date-fns';

// Hooks & Store
import { useScheduleFormInit } from '@/features/schedule/model/useScheduleFormInit';
import { useCreateSchedule } from '@/features/schedule/create/model/useCreateSchedule';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';
import { useCreatePostScheduleStore } from '@/features/schedule/post-schedule/create/model/useCreatePostScheduleStore';
import { useGetPostScheduleQuery } from '@/features/schedule/post-schedule/edit/model/useGetPostScheduleQuery'; // ✅ 추가된 쿼리

// UI & Types
import { mapScheduleFormToRequest } from '@/features/schedule/create/api/mapper';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Alert } from '@/shared/ui/alert/Alert';
import ScheduleForm from '@/widgets/schedule/ui/ScheduleForm';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { ScheduleCategory } from '@/entities/schedule/model/types';

type Props = {
  entryPoint: 'calendar' | 'post'; // 진입점
};

export default function ScheduleEditorContainer({ entryPoint }: Props) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [showExitAlert, setShowExitAlert] = useState(false);

  // --- 1. 파라미터 파싱 ---
  // [Calendar] ID는 URL Path
  const paramId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const scheduleId = paramId ? Number(paramId) : undefined;

  // [Post] ID는 Query String
  const queryPostId = searchParams.get('postId');
  const postId = queryPostId ? Number(queryPostId) : undefined;

  // 모드 설정
  let calendarMode: 'create' | 'edit' = 'create';
  let postMode: 'create' | 'edit' = 'create';

  if (entryPoint === 'calendar') {
    calendarMode = scheduleId ? 'edit' : 'create';
  } else {
    postMode = (searchParams.get('mode') as 'create' | 'edit') || 'create';
  }

  const isCalendarEdit = entryPoint === 'calendar' && calendarMode === 'edit';

  // --- 2. 데이터 패칭 (이원화 전략) ---

  // A. [Calendar Mode] 기존 훅 그대로 사용 (캘린더 수정 시 동작)
  const { initialData: calendarInitialData, isLoading: isCalendarLoading } = useScheduleFormInit({
    entryPoint,
    postMode,
    calendarMode,
    scheduleId,
  });

  // B. [Post Mode] Store 가져오기 (1순위)
  const { linkedSchedule, setLinkedSchedule } = useCreatePostScheduleStore();

  // C. [Post Mode] 서버 데이터 패칭 (2순위 - 새로고침 대비용)
  // postId가 있고, 게시글 모드일 때만 호출 (API: getPostSchedule 사용)
  const { data: serverPostSchedule, isLoading: isPostScheduleLoading } = useGetPostScheduleQuery(
    postId!,
    entryPoint === 'post' && !!postId,
  );

  // --- 3. 최종 초기 데이터 결정 (Merge Logic) ---
  const activeInitialData = useMemo(() => {
    // Case 1: 게시글 모드 - Store에 데이터가 있음 (수정 중) -> 최우선
    if (entryPoint === 'post' && linkedSchedule) {
      return linkedSchedule;
    }

    // Case 2: 게시글 모드 - Store는 비었지만 서버 데이터 있음 (새로고침)
    if (entryPoint === 'post' && serverPostSchedule) {
      const category =
        serverPostSchedule.category === 'operation' || serverPostSchedule.category === 'other'
          ? serverPostSchedule.category
          : 'regular';

      return {
        category: category as ScheduleCategory,
        title: serverPostSchedule.title,
        startDate: new Date(serverPostSchedule.startAt),
        endDate: new Date(serverPostSchedule.endAt),
        location: serverPostSchedule.location ?? '미정',
      } as ScheduleFormData;
    }

    // Case 3: 캘린더 모드 - 기존 훅 데이터 사용
    return calendarInitialData;
  }, [entryPoint, linkedSchedule, serverPostSchedule, calendarInitialData]);

  // --- 4. API Mutations ---
  const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule();
  const { mutate: editSchedule, isPending: isEditing } = useEditSchedule();
  const isPending = isCreating || isEditing;

  // --- 5. React Hook Form ---
  const methods = useForm<ScheduleFormData>({
    defaultValues: {
      category: 'regular',
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '미정',
    },
    values: activeInitialData ?? undefined, // 비동기 데이터 주입 (reset 대신 values 사용 권장)
    mode: 'onChange',
  });

  const title = methods.watch('title');
  const startDate = methods.watch('startDate');
  const endDate = methods.watch('endDate');
  const isFormValid =
    title?.trim().length >= 2 && startDate && endDate && startDate.getTime() <= endDate.getTime();

  // --- 6. 핸들러 ---
  const getHeaderTextBtn = () => {
    if (entryPoint === 'post') return '연동';
    if (isCalendarEdit) return '수정';
    return '완료';
  };

  const currentScheduleId = linkedSchedule?.id || serverPostSchedule?.scheduleId;

  const handleSubmit = (data: ScheduleFormData) => {
    if (!isFormValid || isPending) return;

    // [Post Mode] Zustand 저장 후 복귀
    if (entryPoint === 'post') {
      setLinkedSchedule({
        ...data,
        id: currentScheduleId, // 여기서 ID를 꼭 넣어줘야 합니다!
      });
      if (process.env.NODE_ENV === 'development') console.log('Store 저장 완료');
      router.back();
      return;
    }

    // [Calendar Mode] API 호출
    const baseRequestData = mapScheduleFormToRequest(data);
    const requestData = {
      ...baseRequestData,
      startAt: format(data.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endAt: format(data.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
    };

    if (isCalendarEdit && scheduleId) {
      editSchedule(
        { scheduleId, data: requestData },
        {
          onSuccess: () => {
            alert('일정 수정 완료');
            router.back();
          },
        },
      );
    } else {
      createSchedule(requestData, {
        onSuccess: () => {
          alert('일정 생성 완료');
          router.back();
        },
      });
    }
  };

  const handleBack = () => {
    if ((title?.trim().length ?? 0) >= 2) setShowExitAlert(true);
    else router.back();
  };

  // --- 7. 로딩 처리 ---
  const isLoading =
    entryPoint === 'post'
      ? !linkedSchedule && isPostScheduleLoading // 게시글 모드 로딩 조건
      : isCalendarLoading; // 캘린더 모드 로딩 조건

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <AppHeader
        customBack={handleBack}
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: '일정',
          hasLeftIcon: true,
          text: getHeaderTextBtn(),
          btnVariant: 'secondary',
          isDisabled: !isFormValid || methods.formState.isSubmitting || isPending,
          onClickTextBtn: () => void methods.handleSubmit(handleSubmit)(),
        }}
      />
      <Alert
        state="default"
        title="변경 내용을 저장하지 않고 나가시겠습니까?"
        infoText="작성 중인 내용은 저장되지 않습니다."
        isOpen={showExitAlert}
        onClose={() => setShowExitAlert(false)}
        actions={[
          {
            type: 'solid',
            label: '취소',
            variant: 'secondary',
            onClick: () => setShowExitAlert(false),
          },
          {
            type: 'solid',
            label: '나가기',
            variant: 'danger',
            onClick: () => {
              setShowExitAlert(false);
              router.back();
            },
          },
        ]}
      />
      <FormProvider {...methods}>
        <div className="px-13">
          <ScheduleForm onSubmit={handleSubmit} initialData={activeInitialData} />
        </div>
      </FormProvider>
    </>
  );
}
