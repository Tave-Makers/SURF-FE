'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { Alert } from '@/shared/ui/alert/Alert';
import { HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { ScheduleFormData } from '@/features/calendar/schedule/write/model/types';
import { useEditSchedule } from '@/features/calendar/schedule/edit/model/useEditSchedule';
import { mapScheduleFormToRequest } from '@/features/calendar/schedule/write/api/mapper';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import ScheduleForm from '@/widgets/schedule/ui/ScheduleForm';

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
          <ScheduleForm mode="edit" id={scheduleId} onSubmit={handleSubmit} />
        </div>
      </FormProvider>
    </>
  );
}
