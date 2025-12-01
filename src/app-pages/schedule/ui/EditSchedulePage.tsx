'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';

import ScheduleForm from '@/widgets/schedule/ui/ScheduleForm';
import { ScheduleFormData } from '@/features/calendar/schedule/post/model/types';
import { useEditSchedule } from '@/features/calendar/schedule/edit/model/useEditSchedule';
import { mapScheduleFormToRequest } from '@/features/calendar/schedule/post/api/mapper';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { Alert } from '@/shared/ui/alert/Alert';

export default function EditSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const [showExitAlert, setShowExitAlert] = useState(false);

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

  const isFormValid = useMemo(() => {
    const isTitleValid = (title?.trim().length ?? 0) >= 2;

    const isDateValid =
      startDate instanceof Date &&
      endDate instanceof Date &&
      endDate.getTime() >= startDate.getTime();

    return isTitleValid && isDateValid;
  }, [title, startDate, endDate]);

  const handleSubmit = (data: ScheduleFormData) => {
    if (!isFormValid || isPending || !scheduleId) return;

    const baseRequestData = mapScheduleFormToRequest(data);

    const requestData = {
      ...baseRequestData,
      startAt: format(data.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endAt: format(data.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      location: baseRequestData.location || '',
    };

    editSchedule({
      scheduleId,
      data: requestData,
    });
  };

  const handleAlert = () => {
    if ((title?.trim().length ?? 0) >= 2) {
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
          text: '수정',
          btnVariant: 'secondary',
          isDisabled: !isFormValid || methods.formState.isSubmitting,
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
          <ScheduleForm mode="edit" id={scheduleId} onSubmit={handleSubmit} />
        </div>
      </FormProvider>
    </>
  );
}
