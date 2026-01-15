'use client';

import { Alert } from '@surf/ui/alert';
import { HeaderMode } from '@surf/ui/header';
import { useToastStore } from '@surf/ui/store/toastStore';
import { format, roundToNearestMinutes } from 'date-fns';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

// Hooks & Store
import { mapScheduleFormToRequest, toServerLocation } from '@/features/schedule/create/api/mapper';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { useCreateSchedule } from '@/features/schedule/create/model/useCreateSchedule';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';
import { useScheduleFormInit } from '@/features/schedule/model/useScheduleFormInit';

// UI & Types
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { ScheduleForm } from '@/widgets/schedule/ui/ScheduleForm';

type Props = {
  entryPoint: 'calendar' | 'post'; // 진입점
};

export const ScheduleEditorContainer = ({ entryPoint }: Props) => {
  const router = useRouter();
  const showToast = useToastStore((state) => state.show);
  const params = useParams();
  const searchParams = useSearchParams();
  const [showExitAlert, setShowExitAlert] = useState(false);

  // --- 1. 파라미터 파싱 ---
  // [Calendar] ID는 URL Path
  const paramId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const scheduleId = paramId ? Number(paramId) : undefined;

  // 모드 설정
  let calendarMode: 'create' | 'edit' = 'create';
  let postMode: 'create' | 'edit' = 'create';

  if (entryPoint === 'calendar') {
    calendarMode = scheduleId ? 'edit' : 'create';
  } else {
    postMode = (searchParams.get('mode') as 'create' | 'edit') || 'create';
  }

  const isCalendarEdit = entryPoint === 'calendar' && calendarMode === 'edit';

  // --- 2. 데이터 패칭 & 초기화 ---
  // useScheduleFormInit에서 모든 데이터(Zustand, Server, Calendar)를 통합 관리
  const {
    initialData,
    isLoading: isInitLoading,
    isHydrated,
  } = useScheduleFormInit({
    entryPoint,
    postMode,
    calendarMode,
    scheduleId,
  });

  // [Post Mode] Store에 데이터 저장/복구용 (ID 참조 및 저장)
  const { linkedSchedule, setLinkedSchedule } = useCreatePostScheduleStore();

  // --- 4. API Mutations ---
  const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule();
  const { mutate: editSchedule, isPending: isEditing } = useEditSchedule();
  const isPending = isCreating || isEditing;

  // --- 5. React Hook Form ---
  const getDefaultDate = () =>
    roundToNearestMinutes(new Date(), { nearestTo: 30, roundingMethod: 'ceil' });

  const methods = useForm<ScheduleFormData>({
    defaultValues: {
      category: 'regular',
      title: '',
      startDate: getDefaultDate(),
      endDate: getDefaultDate(),
      location: '',
    },
    values: initialData ?? undefined,
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

  const currentScheduleId =
    linkedSchedule?.id || (entryPoint === 'calendar' ? scheduleId : undefined);

  const handleSubmit = (data: ScheduleFormData) => {
    if (!isFormValid || isPending) return;

    const safeData = {
      ...data,
      location: toServerLocation(data.location),
    };

    // [Post Mode] Zustand 저장 후 복귀
    if (entryPoint === 'post') {
      const roundedStartDate = roundToNearestMinutes(safeData.startDate, { nearestTo: 30 });
      const roundedEndDate = roundToNearestMinutes(safeData.endDate, { nearestTo: 30 });

      setLinkedSchedule({
        ...safeData,
        id: currentScheduleId,
        startDate: roundedStartDate,
        endDate: roundedEndDate,
      });
      router.back();
      return;
    }

    // [Calendar Mode] API 호출
    const baseRequestData = mapScheduleFormToRequest(safeData);
    const requestData = {
      ...baseRequestData,
      startAt: format(safeData.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endAt: format(safeData.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
    };

    if (isCalendarEdit && scheduleId) {
      editSchedule(
        { scheduleId, data: requestData },
        {
          onSuccess: () => {
            showToast('일정이 수정되었습니다.');
            router.back();
          },
        },
      );
    } else {
      createSchedule(requestData, {
        onSuccess: () => {
          showToast('일정이 생성되었습니다.');
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
  const isLoading = useMemo(() => {
    if (!isHydrated) return true;
    return isInitLoading;
  }, [isHydrated, isInitLoading]);

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
};
