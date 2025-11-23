'use client';

import { useState, useMemo, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { ScheduleFormData } from '@/features/calendar/schedule/post/model/types';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { ScheduleSetting } from '@/entities/schedule/ui/ScheduleSetting/ScheduleSetting';
import { ScheduleLocation } from '@/entities/schedule/ui/ScheduleLocation/ScheduleLocation';
import { EventTitle } from '@/entities/schedule/ui/EventTitle/EventTitle';
import { DateTimePicker } from '@/entities/schedule/ui/DateTimePicker/DateTimePicker';
import { Sheet } from '@/shared/ui/sheet/Sheet';

export type SchedulCreateFormProps = {
  mode: 'create' | 'edit';
  onSubmit: (data: ScheduleFormData) => void;
  initialValues?: ScheduleFormData;
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

// RHF 필드 값이 유효한지 확인하고, 유효하지 않으면 현재 날짜를 반환하는 헬퍼 함수
const getInitialDate = (date?: Date): Date =>
  date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

export default function ScheduleForm({ mode, onSubmit, initialValues }: SchedulCreateFormProps) {
  const { control, handleSubmit, watch, reset } = useFormContext<ScheduleFormData>();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  // edit 모드일 때 한 번 기존 값으로 reset
  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      reset(initialValues);
    }
  }, [mode, initialValues, reset]);

  const selectedCategory = watch('category');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  const initialTempStartDate = useMemo(() => getInitialDate(watchedStartDate), [watchedStartDate]);
  const initialTempEndDate = useMemo(() => getInitialDate(watchedEndDate), [watchedEndDate]);

  const [tempStartDate, setTempStartDate] = useState(initialTempStartDate);
  const [tempEndDate, setTempEndDate] = useState(initialTempEndDate);

  /* 시작일 모달 핸들러 */

  // 시작일 모달 열기: RHF 값을 임시 상태에 동기화하고 모달 열기
  const handleOpenStartDate = () => {
    // 모달을 열기 직전에 RHF의 현재 값을 임시 상태의 초기값으로 설정합니다.
    setTempStartDate(getInitialDate(watchedStartDate));
    setIsStartDateOpen(true);
  };

  // 시작일 '예약하기' (저장) 핸들러: 임시 상태를 RHF에 반영하고 모달 닫기
  const handleSaveStartDate = (rhfOnChange: (date: Date) => void) => {
    rhfOnChange(tempStartDate);
    setIsStartDateOpen(false);
  };

  // 시작일 '취소하기' 핸들러: RHF에 반영하지 않고 모달 닫기
  const handleCancelStartDate = () => {
    setIsStartDateOpen(false);
  };

  /* 종료일 모달 핸들러 */

  // 종료일 모달 열기: RHF 값을 임시 상태에 동기화하고 모달 열기
  const handleOpenEndDate = () => {
    setTempEndDate(getInitialDate(watchedEndDate));
    setIsEndDateOpen(true);
  };

  // 종료일 '예약하기' (저장) 핸들러: 임시 상태를 RHF에 반영하고 모달 닫기
  const handleSaveEndDate = (rhfOnChange: (date: Date) => void) => {
    rhfOnChange(tempEndDate);
    setIsEndDateOpen(false);
  };

  // 종료일 '취소하기' 핸들러: RHF에 반영하지 않고 모달 닫기
  const handleCancelEndDate = () => {
    setIsEndDateOpen(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
    >
      {/* 일정 카테고리 선택 */}
      <div>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <>
              <AccordionSelect
                title={selectedCategory ? CATEGORY_LABELS[selectedCategory] : '정규행사'}
                isOpen={isCategoryOpen}
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                controlsId="select-sheet"
              />
              <ModalSheet
                isOpen={isCategoryOpen}
                onClose={() => setIsCategoryOpen(false)}
                aria-labelledby="select-sheet"
                className="flex w-full"
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
                            setIsCategoryOpen(false);
                          }}
                          className={`text-foreground-foreground-normal text-body-body5 flex w-full flex-1 items-center px-12 py-10 ${
                            selectedCategory === option.value
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
                  onTap={() => setIsCategoryOpen(false)}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
                />
              </ModalSheet>
            </>
          )}
        />
      </div>

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
      <div className="border-border-border-tertiary mt-[1.31rem] h-[0.06rem] self-stretch" />

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
                onClick={handleOpenStartDate}
              />
              <ModalSheet
                isOpen={isStartDateOpen}
                onClose={handleCancelStartDate}
                className="flex w-full"
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
                        onClick: () => handleSaveStartDate(field.onChange),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        // RHF에 반영하지 않고 닫기
                        onClick: handleCancelStartDate,
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
                  onTap={handleCancelStartDate}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
                />
              </ModalSheet>
            </>
          )}
        />
      </div>

      {/* 구분선 */}
      <div className="border-border-border-tertiary h-[0.06rem] self-stretch" />

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
                onClick={handleOpenEndDate}
              />
              <ModalSheet
                isOpen={isEndDateOpen}
                onClose={handleCancelEndDate}
                className="flex w-full"
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
                        onClick: () => handleSaveEndDate(field.onChange),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        // RHF에 반영하지 않고 닫기
                        onClick: handleCancelEndDate,
                      }}
                    >
                      {/* DateTimePicker는 임시 상태를 사용하고, 임시 상태를 업데이트 */}
                      <DateTimePicker value={tempEndDate} onChange={setTempEndDate} />
                    </Sheet>
                  </ModalSheet.Content>
                </ModalSheet.Container>
                <ModalSheet.Backdrop
                  onTap={handleCancelEndDate}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
                />
              </ModalSheet>
            </>
          )}
        />
      </div>

      {/* 구분선 */}
      <div className="border-border-border-tertiary h-[0.06rem] self-stretch" />

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
        <div className="border-border-border-tertiary h-[0.06rem] self-stretch" />
      </div>
    </form>
  );
}
