'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { ScheduleFormData } from '@/features/calendar/schedule/model/types';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { ScheduleSetting } from '@/entities/schedule/ui/ScheduleSetting/ScheduleSetting';
import { ScheduleLocation } from '@/entities/schedule/ui/ScheduleLocation/ScheduleLocation';
import { EventTitle } from '@/entities/schedule/ui/EventTitle/EventTitle';
import { DateTimePicker } from '@/entities/schedule/ui/DateTimePicker/DateTimePicker';
import { Sheet } from '@/shared/ui/sheet/Sheet';

export type SchedulCreateFormProps = { onSubmit: (data: ScheduleFormData) => void };

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

export default function ScheduleCreateForm({ onSubmit }: SchedulCreateFormProps) {
  const { control, handleSubmit, watch } = useFormContext<ScheduleFormData>();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const selectedCategory = watch('category');

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
      <div className="border-border-border-tertiary mt-[1.31rem] h-[0.06rem] self-stretch border" />

      {/* 시작일/마감일 */}
      <div>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <>
              <ScheduleSetting
                title="시작"
                date={field.value}
                onClick={() => setIsStartDateOpen(true)}
              />
              <ModalSheet
                isOpen={isStartDateOpen}
                onClose={() => setIsStartDateOpen(false)}
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
                        onClick: () => setIsStartDateOpen(false),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        onClick: () => setIsStartDateOpen(false),
                      }}
                    >
                      <div>
                        <DateTimePicker value={field.value} onChange={field.onChange} />
                      </div>
                    </Sheet>
                  </ModalSheet.Content>
                </ModalSheet.Container>
                <ModalSheet.Backdrop
                  onTap={() => setIsStartDateOpen(false)}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
                />
              </ModalSheet>
            </>
          )}
        />
      </div>

      {/* 구분선 */}
      <div className="border-border-border-tertiary h-[0.06rem] self-stretch border" />

      <div>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <>
              <ScheduleSetting
                title="종료"
                date={field.value}
                onClick={() => setIsEndDateOpen(true)}
              />
              <ModalSheet
                isOpen={isEndDateOpen}
                onClose={() => setIsEndDateOpen(false)}
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
                        onClick: () => setIsEndDateOpen(false),
                      }}
                      secondaryBtn={{
                        label: '취소하기',
                        onClick: () => setIsEndDateOpen(false),
                      }}
                    >
                      <DateTimePicker value={field.value} onChange={field.onChange} />
                    </Sheet>
                  </ModalSheet.Content>
                </ModalSheet.Container>
                <ModalSheet.Backdrop
                  onTap={() => setIsEndDateOpen(false)}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
                />
              </ModalSheet>
            </>
          )}
        />
      </div>

      {/* 구분선 */}
      <div className="border-border-border-tertiary h-[0.06rem] self-stretch border" />

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
        <div className="border-border-border-tertiary h-[0.06rem] self-stretch border" />
      </div>
    </form>
  );
}
