'use client';

import { useState, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { ScheduleSetting } from '@/entities/schedule/ui/ScheduleSetting/ScheduleSetting';
import { ScheduleLocation } from '@/entities/schedule/ui/ScheduleLocation/ScheduleLocation';
import { EventTitle } from '@/entities/schedule/ui/EventTitle/EventTitle';
import { DateTimePicker } from '@/entities/schedule/ui/DateTimePicker/DateTimePicker';
import { getInitialDate } from '@/entities/calendar/utils/getInitialDate';
import { CATEGORY_LABELS } from '@/entities/schedule/model/constants';
import { SCHEDULE_CATEGORIES } from '@/entities/schedule/model/constants';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { ensureUtcDate } from '@/features/schedule/lib/ensureUtcDate';

export type ScheduleFormProps = {
  onSubmit: (data: ScheduleFormData) => void;
  initialData?: ScheduleFormData | null;
};

export default function ScheduleForm({ onSubmit, initialData }: ScheduleFormProps) {
  const { control, handleSubmit, watch, reset } = useFormContext<ScheduleFormData>();
  const [openModal, setOpenModal] = useState<'category' | 'startDate' | 'endDate' | null>(null);

  // 1. 부모로부터 데이터가 들어오면 폼 리셋
  useEffect(() => {
    if (initialData) {
      reset({
        category: initialData.category || 'regular',
        title: initialData.title ?? '',
        startDate: ensureUtcDate(initialData.startDate),
        endDate: ensureUtcDate(initialData.endDate),
        location: initialData.location ?? '',
      });
    }
  }, [initialData, reset]);

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  const initialTempStartDate = useMemo(() => getInitialDate(watchedStartDate), [watchedStartDate]);
  const initialTempEndDate = useMemo(() => getInitialDate(watchedEndDate), [watchedEndDate]);

  const [tempStartDate, setTempStartDate] = useState(initialTempStartDate);
  const [tempEndDate, setTempEndDate] = useState(initialTempEndDate);

  const handleOpenDateModal = (type: 'startDate' | 'endDate') => {
    if (type === 'startDate') setTempStartDate(getInitialDate(watchedStartDate));
    else setTempEndDate(getInitialDate(watchedEndDate));
    setOpenModal(type);
  };

  const handleSaveDate = (type: 'startDate' | 'endDate', rhfOnChange: (date: Date) => void) => {
    rhfOnChange(type === 'startDate' ? tempStartDate : tempEndDate);
    setOpenModal(null);
  };

  const handleCloseModal = () => setOpenModal(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
    >
      {/* 1. 카테고리 */}
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <div>
            <AccordionSelect
              title={field.value ? CATEGORY_LABELS[field.value] : '정규행사'}
              isOpen={openModal === 'category'}
              onClick={() => setOpenModal(openModal === 'category' ? null : 'category')}
              controlsId="select-sheet"
            />
            <ModalSheet
              isOpen={openModal === 'category'}
              onClose={handleCloseModal}
              className="mx-auto flex w-full sm:w-[360px]"
            >
              <ModalSheet.Container>
                <ModalSheet.Content>
                  <Sheet>
                    <div className="rounded-4 flex flex-col gap-4 pt-16 pb-15">
                      {SCHEDULE_CATEGORIES.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            field.onChange(option.value);
                            handleCloseModal();
                          }}
                          className={`text-foreground-normal text-body-body6 flex w-full flex-1 items-center px-12 py-10 ${
                            field.value === option.value
                              ? 'bg-background-secondary'
                              : 'hover:bg-background-secondary'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </Sheet>
                </ModalSheet.Content>
              </ModalSheet.Container>
              <ModalSheet.Backdrop
                onTap={handleCloseModal}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
              />
            </ModalSheet>
          </div>
        )}
      />

      {/* 2. 제목 */}
      <div className="pt-10">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <EventTitle
              placeholder="제목을 입력해 주세요"
              title={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <hr className="border-border-tertiary mt-[1.31rem] h-[0.06rem] w-full self-stretch" />

      {/* 3. 시작일 */}
      <div>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <>
              <ScheduleSetting
                title="시작"
                date={field.value}
                onClick={() => handleOpenDateModal('startDate')}
              />
              <ModalSheet
                isOpen={openModal === 'startDate'}
                onClose={handleCloseModal}
                className="mx-auto flex w-full sm:w-[360px]"
              >
                <ModalSheet.Container>
                  <ModalSheet.Content>
                    <Sheet
                      title="일정 시작 설정"
                      description="해당 시간에 맞춰 일정이 생성됩니다"
                      primaryBtn={{
                        label: '예약하기',
                        onClick: () => handleSaveDate('startDate', field.onChange),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        onClick: handleCloseModal,
                      }}
                    >
                      <div className="py-15">
                        <DateTimePicker
                          value={tempStartDate}
                          onChange={setTempStartDate}
                          mode="all"
                        />
                      </div>
                    </Sheet>
                  </ModalSheet.Content>
                </ModalSheet.Container>
                <ModalSheet.Backdrop
                  onTap={handleCloseModal}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
                />
              </ModalSheet>
            </>
          )}
        />
      </div>

      <hr className="border-border-tertiary h-[0.06rem] w-full self-stretch" />

      {/* 4. 종료일 */}
      <div>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <>
              <ScheduleSetting
                title="종료"
                date={field.value}
                onClick={() => handleOpenDateModal('endDate')}
              />
              <ModalSheet
                isOpen={openModal === 'endDate'}
                onClose={handleCloseModal}
                className="mx-auto flex w-full sm:w-[360px]"
              >
                <ModalSheet.Container>
                  <ModalSheet.Content>
                    <Sheet
                      title="일정 종료 설정"
                      description="해당 시간에 맞춰 일정이 생성됩니다"
                      primaryBtn={{
                        label: '예약하기',
                        onClick: () => handleSaveDate('endDate', field.onChange),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        onClick: handleCloseModal,
                      }}
                    >
                      <div className="py-15">
                        <DateTimePicker value={tempEndDate} onChange={setTempEndDate} mode="all" />
                      </div>
                    </Sheet>
                  </ModalSheet.Content>
                </ModalSheet.Container>
                <ModalSheet.Backdrop
                  onTap={handleCloseModal}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
                />
              </ModalSheet>
            </>
          )}
        />
      </div>

      <hr className="border-border-tertiary h-[0.06rem] w-full self-stretch" />

      {/* 5. 장소 */}
      <div>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <ScheduleLocation
              title="장소"
              placeholder="장소 입력"
              location={field.value || '미정'}
              onChange={field.onChange}
            />
          )}
        />
        <hr className="border-border-tertiary h-[0.06rem] w-full self-stretch" />
      </div>
    </form>
  );
}
