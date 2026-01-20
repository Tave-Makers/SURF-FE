'use client';

import { AccordionSelect } from '@surf/ui/accordion';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { getInitialDate } from '@/entities/calendar/utils/getInitialDate';
import { CATEGORY_LABELS } from '@/entities/schedule/model/constants';
import { EventTitle } from '@/entities/schedule/ui/EventTitle/EventTitle';
import { ScheduleLocation } from '@/entities/schedule/ui/ScheduleLocation/ScheduleLocation';
import { ScheduleSetting } from '@/entities/schedule/ui/ScheduleSetting/ScheduleSetting';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { ensureUtcDate } from '@/features/schedule/lib/ensureUtcDate';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

export type ScheduleFormProps = {
  onSubmit: (data: ScheduleFormData) => void;
  initialData?: ScheduleFormData | null;
};

export const ScheduleForm = ({ onSubmit, initialData }: ScheduleFormProps) => {
  const { control, handleSubmit, reset } = useFormContext<ScheduleFormData>();
  const openBottomSheet = useBottomSheetStore((s) => s.open);

  const [dateConfirmed, setDateConfirmed] = useState({
    startDate: !!initialData,
    endDate: !!initialData,
  });

  // 1. 부모로부터 데이터가 들어오면 폼 리셋
  useEffect(() => {
    if (initialData) {
      reset({
        category: initialData.category || '정규행사',
        title: initialData.title ?? '',
        startDate: ensureUtcDate(initialData.startDate),
        endDate: ensureUtcDate(initialData.endDate),
        location: initialData.location ?? '',
      });
      setDateConfirmed({ startDate: true, endDate: true });
    }
  }, [initialData, reset]);

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
              isOpen={false}
              onClick={() => {
                openBottomSheet({
                  type: 'scheduleCategory',
                  props: {
                    selectedCategory: field.value,
                    onSelect: (val) => {
                      field.onChange(val);
                    },
                  },
                });
              }}
              controlsId="select-sheet"
            />
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
                isSelected={dateConfirmed.startDate}
                onClick={() => {
                  openBottomSheet({
                    type: 'scheduleDate',
                    props: {
                      title: '일정 시작 설정',
                      description: '해당 시간에 맞춰 일정이 생성됩니다',
                      initialDate: getInitialDate(field.value),
                      onSave: (date) => {
                        field.onChange(date);
                        setDateConfirmed((prev) => ({ ...prev, startDate: true }));
                      },
                    },
                  });
                }}
              />
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
                isSelected={dateConfirmed.endDate}
                onClick={() => {
                  openBottomSheet({
                    type: 'scheduleDate',
                    props: {
                      title: '일정 종료 설정',
                      description: '해당 시간에 맞춰 일정이 생성됩니다',
                      initialDate: getInitialDate(field.value),
                      onSave: (date) => {
                        field.onChange(date);
                        setDateConfirmed((prev) => ({ ...prev, endDate: true }));
                      },
                    },
                  });
                }}
              />
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
              location={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        />
        <hr className="border-border-tertiary h-[0.06rem] w-full self-stretch" />
      </div>
    </form>
  );
};
