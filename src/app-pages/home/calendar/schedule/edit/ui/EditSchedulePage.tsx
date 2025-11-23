'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import ScheduleForm from '@/widgets/schedule/ui/ScheduleForm';
import { ScheduleFormData } from '@/features/calendar/schedule/post/model/types';
import { useEditSchedule } from '@/features/calendar/schedule/edit/model/useEditSchedule';
import { mapScheduleFormToRequest } from '@/features/calendar/schedule/post/api/mapper';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode, HeaderProps } from '@/shared/ui/header/Header';

export default function EditSchedulePage() {
  const params = useParams();
  const router = useRouter();

  const scheduleIdParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const scheduleId = scheduleIdParam ? Number(scheduleIdParam) : undefined;

  const { mutate: editSchedule, isPending } = useEditSchedule({
    onSuccess: () => {
      alert('일정 수정 완료');
      router.back();
    },
    onError: () => {
      alert('일정 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    },
  });

  const methods = useForm<ScheduleFormData>({
    defaultValues: {
      category: 'regular',
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '',
    },
    mode: 'onChange',
  });

  const title = methods.watch('title');
  const startDate = methods.watch('startDate');
  const endDate = methods.watch('endDate');

  const isFormValid =
    title.trim().length >= 2 &&
    startDate instanceof Date &&
    endDate instanceof Date &&
    endDate.getTime() >= startDate.getTime();

  const handleSubmit = (data: ScheduleFormData) => {
    if (!isFormValid || isPending || !scheduleId) return;

    const requestData = mapScheduleFormToRequest(data);

    editSchedule({
      scheduleId,
      data: {
        ...requestData,
        location: requestData.location || '',
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
          text: '수정',
          btnVariant: 'secondary',
          isDisabled: !isFormValid || methods.formState.isSubmitting,
          onClickTextBtn: () => void methods.handleSubmit(handleSubmit)(),
        }))()}
      />

      <FormProvider {...methods}>
        <div className="px-13">
          <ScheduleForm mode="edit" scheduleId={scheduleId} onSubmit={handleSubmit} />
        </div>
      </FormProvider>
    </>
  );
}
