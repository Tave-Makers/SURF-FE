'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import ScheduleCreateForm from '@/widgets/schedule/ui/ScheduleCreateForm';
import { ScheduleFormData } from '@/features/calendar/schedule/model/types';
import { usePostSchedule } from '@/features/calendar/schedule/model/usePostSchedule';
import { mapScheduleFormToRequest } from '@/features/calendar/schedule/api/mapper';

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
    // 제목 검증: 공백 제외 2자 이상, 20자 이하
    const trimmedTitle = title?.trim() || '';
    const isTitleValid = trimmedTitle.length >= 2 && trimmedTitle.length <= 20;

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

    console.log('1. 폼 제출 함수 호출됨');
    console.log('2. 원본 폼 데이터:', data);

    const requestData = mapScheduleFormToRequest(data);
    console.log('3. 서버로 보낼 변환된 데이터:', requestData);

    createSchedule(requestData, {
      onSuccess: () => {
        console.log('4. API 성공!');
        alert('일정 생성 완료');
      },
      onError: (error) => {
        console.error('4. API 실패 원인:', error);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="px-13">
        <ScheduleCreateForm onSubmit={handleSubmit} />
      </div>
    </FormProvider>
  );
}
