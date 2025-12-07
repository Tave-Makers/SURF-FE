'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { Alert } from '@/shared/ui/alert/Alert';
import { HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { getInitialDate } from '@/entities/calendar/utils/getInitialTime';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { useCreateSchedule } from '@/features/schedule/create/model/useCreateSchedule';
import { mapScheduleFormToRequest } from '@/features/schedule/create/api/mapper';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import ScheduleForm from '@/widgets/schedule/ui/ScheduleForm';

export default function CreateSchedulePage() {
  const router = useRouter();
  const [showExitAlert, setShowExitAlert] = useState(false);
  const { mutate: createSchedule, isPending } = useCreateSchedule();

  const methods = useForm<ScheduleFormData>({
    defaultValues: {
      category: 'regular',
      title: '',
      startDate: getInitialDate(),
      endDate: getInitialDate(),
      location: '',
    },
    mode: 'onChange',
  });

  // 폼 값 실시간 감시
  const title = methods.watch('title');
  const startDate = methods.watch('startDate');
  const endDate = methods.watch('endDate');

  // 제목 검증: 최소 2자 이상
  const isTitleValid = title.trim().length >= 2;

  // 시작일/마감일 검증: 둘 다 선택되어 있고, 마감일이 시작일과 같거나 이후
  const isDateValid =
    startDate instanceof Date &&
    endDate instanceof Date &&
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime()) &&
    endDate.getTime() >= startDate.getTime();

  // 최종 버튼 활성화 조건
  const isFormValid = isTitleValid && isDateValid;

  const handleSubmit = (data: ScheduleFormData) => {
    if (!isFormValid || isPending) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('폼 제출 시도:', data);
    }

    const baseRequestData = mapScheduleFormToRequest(data);
    const requestData = {
      ...baseRequestData,
      startAt: format(data.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endAt: format(data.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
    };
    if (process.env.NODE_ENV === 'development') {
      console.log('서버로 보낼 변환된 데이터:', requestData);
    }

    createSchedule(requestData, {
      onSuccess: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('일정 생성 요청 성공');
        }
        alert('일정 생성 완료');
        router.back();
      },
      onError: (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('일정 생성 요청 실패:', error);
        }
        alert('일정 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      },
    });
  };

  const handleAlert = () => {
    if (title.trim().length >= 2) {
      setShowExitAlert(true);
    } else {
      router.back();
    }
  };

  return (
    <>
      <AppHeader
        customBack={handleAlert}
        overrideHeader={((): HeaderProps => ({
          mode: HeaderMode.TextBtn,
          title: '일정',
          hasLeftIcon: true,
          text: '완료',
          btnVariant: 'secondary',
          isDisabled: !isFormValid || methods.formState.isSubmitting || isPending,
          onClickTextBtn: () => void methods.handleSubmit(handleSubmit)(),
        }))()}
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
          <ScheduleForm mode="create" onSubmit={handleSubmit} />
        </div>
      </FormProvider>
    </>
  );
}
