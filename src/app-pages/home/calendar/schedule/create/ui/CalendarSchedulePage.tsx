'use client';

import { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ScheduleCreateForm from '@/widgets/schedule/ui/ScheduleCreateForm';
import { ScheduleFormData } from '@/features/calendar/schedule/model/types';
import { usePostSchedule } from '@/features/calendar/schedule/model/usePostSchedule';
import { mapScheduleFormToRequest } from '@/features/calendar/schedule/api/mapper';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode, HeaderProps } from '@/shared/ui/header/Header';

export default function CalendarSchedulePage() {
  const { mutate: createSchedule } = usePostSchedule();

  const methods = useForm<ScheduleFormData>({
    defaultValues: {
      category: 'regular',
      title: '',
      content: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '',
    },
    mode: 'onChange',
  });

  // 폼 값 실시간 감시
  const title = methods.watch('title');
  const startDate = methods.watch('startDate');
  const endDate = methods.watch('endDate');

  // 버튼 활성화 조건 검증
  const isFormValid = useMemo(() => {
    // 제목 검증: 최소 2자 이상
    const isTitleValid = title.trim().length >= 2;

    // 시작일/마감일 검증: 둘 다 선택되어 있고, 마감일이 시작일과 같거나 이후
    const isDateValid =
      startDate instanceof Date &&
      endDate instanceof Date &&
      !isNaN(startDate.getTime()) &&
      !isNaN(endDate.getTime()) &&
      endDate.getTime() >= startDate.getTime();

    return isTitleValid && isDateValid;
  }, [title, startDate, endDate]);

  const handleSubmit = (data: ScheduleFormData) => {
    if (!isFormValid) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('폼 제출 시도:', data);
    }

    const requestData = mapScheduleFormToRequest(data);
    if (process.env.NODE_ENV === 'development') {
      console.log('서버로 보낼 변환된 데이터:', requestData);
    }

    createSchedule(requestData, {
      onSuccess: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('일정 생성 요청 성공');
        }
        alert('일정 생성 완료');
      },
      onError: (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('일정 생성 요청 실패:', error);
        }
      },
    });
  };

  return (
    <>
      <AppHeader
        overrideHeader={((): HeaderProps => ({
          mode: HeaderMode.TextBtn,
          title: '일정',
          hasLeftIcon: true,
          text: '완료',
          btnVariant: 'secondary',
          isDisabled: !isFormValid || methods.formState.isSubmitting,
          onClickTextBtn: () => void methods.handleSubmit(handleSubmit)(),
        }))()}
      />

      <FormProvider {...methods}>
        <div className="px-13">
          <ScheduleCreateForm onSubmit={handleSubmit} />
        </div>
      </FormProvider>
    </>
  );
}
