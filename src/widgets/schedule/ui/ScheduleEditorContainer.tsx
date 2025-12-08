'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { useScheduleFormInit } from '@/features/schedule/model/useScheduleFormInit';
import { useCreateSchedule } from '@/features/schedule/create/model/useCreateSchedule';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { mapScheduleFormToRequest } from '@/features/schedule/create/api/mapper';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Alert } from '@/shared/ui/alert/Alert';
import ScheduleForm from '@/widgets/schedule/ui/ScheduleForm';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { format } from 'date-fns';

type Props = {
  entryPoint: 'calendar' | 'post'; // 진입점
};

export default function ScheduleEditorContainer({ entryPoint }: Props) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [showExitAlert, setShowExitAlert] = useState(false);

  // --- 1. 파라미터 및 모드 파악---
  let scheduleId: number | undefined;
  let calendarMode: 'create' | 'edit' = 'create'; // 기본값 create
  let postMode: 'create' | 'edit' = 'create'; // 기본값 create

  if (entryPoint === 'calendar') {
    // [Calendar] ID는 URL Path에서만 가져옴
    const paramId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    scheduleId = paramId ? Number(paramId) : undefined;

    // ID가 있으면 수정 모드
    calendarMode = scheduleId ? 'edit' : 'create';
  } else {
    // [Post] ID는 Query String에서만 가져옴
    const queryId = searchParams.get('scheduleId');
    scheduleId = queryId ? Number(queryId) : undefined;

    // 모드는 Query String의 'mode' 파라미터 사용
    postMode = (searchParams.get('mode') as 'create' | 'edit') || 'create';
  }

  // UI 제어용 플래그 (캘린더 수정 상태인지)
  const isCalendarEdit = entryPoint === 'calendar' && calendarMode === 'edit';

  // --- 2. 로직 훅 호출 (데이터 초기화) ---
  const { initialData, isLoading } = useScheduleFormInit({
    entryPoint,
    postMode,
    calendarMode,
    scheduleId,
  });

  // --- 3. API & Store ---
  const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule();
  const { mutate: editSchedule, isPending: isEditing } = useEditSchedule();
  const { setLinkedSchedule } = useCreatePostScheduleStore();

  const isPending = isCreating || isEditing;

  const methods = useForm<ScheduleFormData>({
    defaultValues: {
      category: 'regular',
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '미정',
    },
    mode: 'onChange',
  });

  const title = methods.watch('title');
  const startDate = methods.watch('startDate');
  const endDate = methods.watch('endDate');

  // 유효성 검사
  const isFormValid =
    title?.trim().length >= 2 && startDate && endDate && startDate.getTime() <= endDate.getTime();

  // --- 4. 헤더 설정 ---
  const getHeaderTextBtn = () => {
    if (entryPoint === 'post') return '연동'; // 게시글 모드
    if (isCalendarEdit) return '수정'; // 캘린더 수정
    return '완료'; // 캘린더 생성
  };

  // --- 5. 제출 핸들러 (동작 분기) ---
  const handleSubmit = (data: ScheduleFormData) => {
    if (!isFormValid || isPending) return;

    // Case A: 게시글 모드 -> Zustand 저장
    if (entryPoint === 'post') {
      setLinkedSchedule(data);
      console.log(data);
      // TODO: 로그 삭제
      if (process.env.NODE_ENV === 'development') {
        console.log('게시글 모드: 일정 정보 store 저장 완료');
      }
      router.back();
      return;
    }

    // Case B: 캘린더 모드 -> API 호출
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
            // TODO: 로그 삭제
            if (process.env.NODE_ENV === 'development') {
              console.log('캘린더 모드: 일정 수정 완료');
            }
            router.back();
          },
        },
      );
    } else {
      createSchedule(requestData, {
        onSuccess: () => {
          alert('일정 생성 완료');
          // TODO: 로그 삭제
          if (process.env.NODE_ENV === 'development') {
            console.log('캘린더 모드: 일정 생성 완료');
          }
          router.back();
        },
      });
    }
  };

  const handleBack = () => {
    if ((title?.trim().length ?? 0) >= 2) setShowExitAlert(true);
    else router.back();
  };

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
          <ScheduleForm onSubmit={handleSubmit} initialData={initialData} />
        </div>
      </FormProvider>
    </>
  );
}
