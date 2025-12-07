'use client';

import { useState, useMemo, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { ScheduleSetting } from '@/entities/schedule/ui/ScheduleSetting/ScheduleSetting';
import { ScheduleLocation } from '@/entities/schedule/ui/ScheduleLocation/ScheduleLocation';
import { EventTitle } from '@/entities/schedule/ui/EventTitle/EventTitle';
import { DateTimePicker } from '@/entities/schedule/ui/DateTimePicker/DateTimePicker';
import { ScheduleFormData } from '@/features/calendar/schedule/post/model/types';
import { useGetSingleSchedule } from '@/features/calendar/schedule/edit/model/useGetSingleSchedule';

export type ScheduleFormProps = {
  mode: 'create' | 'edit';
  id?: number;
  onSubmit: (data: ScheduleFormData) => void;
};

// 카테고리 한글 매핑
const CATEGORY_LABELS: Record<ScheduleCategory, string> = {
  regular: '정규행사',
  operation: '운영회의',
  other: '기타일정',
};

const CATEGORY_OPTIONS: { value: ScheduleCategory; label: string }[] = [
  { value: 'regular', label: '정규행사' },
  { value: 'operation', label: '운영회의' },
  { value: 'other', label: '기타일정' },
];

const CATEGORY_MAP: Record<string, ScheduleCategory> = {
  정규행사: 'regular',
  운영회의: 'operation',
  기타일정: 'other',
};

// RHF 필드 값이 유효한지 확인하고, 유효하지 않으면 현재 날짜를 반환하는 헬퍼 함수
const getInitialDate = (date?: Date): Date =>
  date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

export default function ScheduleForm({ mode = 'create', id, onSubmit }: ScheduleFormProps) {
  const { control, handleSubmit, watch, reset } = useFormContext<ScheduleFormData>();

  const [openModal, setOpenModal] = useState<'category' | 'startDate' | 'endDate' | null>(null);

  const scheduleId = id || 0;
  const { data: scheduleDetail } = useGetSingleSchedule(scheduleId, mode);

  // edit 모드일 때 한 번 기존 값으로 reset
  useEffect(() => {
    if (mode === 'edit' && scheduleDetail) {
      reset({
        category: CATEGORY_MAP[scheduleDetail.category] || 'regular',
        title: scheduleDetail.title ?? '',
        startDate: scheduleDetail.startAt ? new Date(scheduleDetail.startAt) : new Date(),
        endDate: scheduleDetail.endAt ? new Date(scheduleDetail.endAt) : new Date(),
        location: scheduleDetail.location ?? '',
      });
    }
  }, [mode, scheduleDetail, reset]);

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  const initialTempStartDate = useMemo(() => getInitialDate(watchedStartDate), [watchedStartDate]);
  const initialTempEndDate = useMemo(() => getInitialDate(watchedEndDate), [watchedEndDate]);

  const [tempStartDate, setTempStartDate] = useState(initialTempStartDate);
  const [tempEndDate, setTempEndDate] = useState(initialTempEndDate);

  // 날짜 모달 열기 핸들러
  const handleOpenDateModal = (type: 'startDate' | 'endDate') => {
    if (type === 'startDate') {
      setTempStartDate(getInitialDate(watchedStartDate));
    } else {
      setTempEndDate(getInitialDate(watchedEndDate));
    }
    setOpenModal(type);
  };

  // 날짜 저장 핸들러
  const handleSaveDate = (type: 'startDate' | 'endDate', rhfOnChange: (date: Date) => void) => {
    rhfOnChange(type === 'startDate' ? tempStartDate : tempEndDate);
    setOpenModal(null);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
    >
      {/* 일정 카테고리 선택 */}
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
              aria-labelledby="select-sheet"
              className="mx-auto flex w-full sm:w-[360px]"
            >
              <ModalSheet.Container>
                <ModalSheet.Header />
                <ModalSheet.Content>
                  <div
                    id="select-sheet"
                    className="rounded-4 flex flex-col gap-4 px-15 pt-16 pb-15"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          field.onChange(option.value);
                          handleCloseModal();
                        }}
                        className={`text-foreground-foreground-normal text-body-body5 flex w-full flex-1 items-center px-12 py-10 ${
                          field.value === option.value
                            ? 'bg-background-background-secondary'
                            : 'hover:bg-background-background-secondary'
                        } `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
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

      {/* 이벤트 title */}
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

      {/* 구분선 */}
      <hr className="border-border-border-tertiary mt-[1.31rem] h-[0.06rem] w-full self-stretch" />

      {/* 시작일/마감일 */}
      <div>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <>
              <ScheduleSetting
                title="시작"
                // RHF 필드 값 표시
                date={field.value}
                // 모달 열기 시 임시 상태 동기화 및 모달 열기
                onClick={() => handleOpenDateModal('startDate')}
              />
              <ModalSheet
                isOpen={openModal === 'startDate'}
                onClose={handleCloseModal}
                className="mx-auto flex w-full sm:w-[360px]"
              >
                <ModalSheet.Container>
                  <ModalSheet.Header />
                  <ModalSheet.Content>
                    <Sheet
                      title="일정 시작 설정"
                      description="해당 시간에 맞춰 일정이 생성됩니다"
                      primaryBtn={{
                        label: '예약하기',
                        // 임시 상태를 RHF에 반영
                        onClick: () => handleSaveDate('startDate', field.onChange),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        // RHF에 반영하지 않고 닫기
                        onClick: handleCloseModal,
                      }}
                    >
                      <div>
                        {/* DateTimePicker는 임시 상태를 사용하고, 임시 상태를 업데이트 */}
                        <DateTimePicker value={tempStartDate} onChange={setTempStartDate} />
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

      {/* 구분선 */}
      <hr className="border-border-border-tertiary h-[0.06rem] w-full self-stretch" />

      <div>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <>
              <ScheduleSetting
                title="종료"
                // RHF 필드 값 표시
                date={field.value}
                // 모달 열기 시 임시 상태 동기화 및 모달 열기
                onClick={() => handleOpenDateModal('endDate')}
              />
              <ModalSheet
                isOpen={openModal === 'endDate'}
                onClose={handleCloseModal}
                className="mx-auto flex w-full sm:w-[360px]"
              >
                <ModalSheet.Container>
                  <ModalSheet.Header />
                  <ModalSheet.Content>
                    <Sheet
                      title="일정 종료 설정"
                      description="해당 시간에 맞춰 일정이 생성됩니다"
                      primaryBtn={{
                        label: '예약하기',
                        // 임시 상태를 RHF에 반영
                        onClick: () => handleSaveDate('endDate', field.onChange),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        // RHF에 반영하지 않고 닫기
                        onClick: handleCloseModal,
                      }}
                    >
                      {/* DateTimePicker는 임시 상태를 사용하고, 임시 상태를 업데이트 */}
                      <DateTimePicker value={tempEndDate} onChange={setTempEndDate} />
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

      {/* 구분선 */}
      <hr className="border-border-border-tertiary h-[0.06rem] w-full self-stretch" />

      {/* 장소(선택) */}
      <div>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <ScheduleLocation
              title="장소"
              placeholder="장소 입력"
              location={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />

        {/* 구분선 */}
        <hr className="border-border-border-tertiary h-[0.06rem] w-full self-stretch" />
      </div>
    </form>
  );
}
