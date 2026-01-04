'use client';

import { memo } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormTrigger,
  useWatch,
} from 'react-hook-form';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { Toggle } from '@/shared/ui/toggle/Toggle';
import { formatYearMonth } from '@/shared/lib/validator';
import type { FormValues } from '../model/types';

interface CareerItemProps {
  index: number;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
  trigger: UseFormTrigger<FormValues>;
  onDelete: () => void;
}

export const CareerItem = memo(function CareerItem({
  index,
  control,
  errors,
  setValue,
  clearErrors,
  trigger,
  onDelete,
}: CareerItemProps) {
  const isWorking = useWatch({
    control,
    name: `careers.${index}.isWorking`,
  });

  const startErr = errors.careers?.[index]?.startDate?.message;
  const endErr = errors.careers?.[index]?.endDate?.message;

  return (
    <div className="border-border-quaternary flex w-full flex-col gap-16">
      <FieldGroup title={`회사명 ${index + 1}`}>
        <Controller
          control={control}
          name={`careers.${index}.companyName`}
          rules={{ required: '회사명은 필수에요.' }}
          render={({ field }) => (
            <TextArea
              {...field}
              mode="oneLine"
              placeholder="회사명을 입력하세요"
              errorMessage={errors.careers?.[index]?.companyName?.message}
            />
          )}
        />
      </FieldGroup>

      <FieldGroup title="직책">
        <Controller
          control={control}
          name={`careers.${index}.position`}
          rules={{ required: '직책은 필수에요.' }}
          render={({ field }) => (
            <TextArea
              {...field}
              mode="oneLine"
              placeholder="직책 (예: 프론트엔드 개발자)"
              errorMessage={errors.careers?.[index]?.position?.message}
            />
          )}
        />
      </FieldGroup>

      <FieldGroup
        title="현재 재직 중"
        headerRight={
          <Controller
            control={control}
            name={`careers.${index}.isWorking`}
            render={({ field }) => (
              <Toggle
                isChecked={!!field.value}
                onChange={(checked) => {
                  field.onChange(checked);

                  if (checked) {
                    setValue(`careers.${index}.endDate`, '', { shouldDirty: true });
                    clearErrors(`careers.${index}.endDate`);
                  } else {
                    void trigger(`careers.${index}.endDate`);
                  }
                }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                onMouseDown={(e) => e.preventDefault()}
              />
            )}
          />
        }
      >
        <div className="flex flex-row items-center gap-4">
          <Controller
            control={control}
            name={`careers.${index}.startDate`}
            rules={{ required: '시작일은 필수에요.' }}
            render={({ field }) => (
              <TextArea
                {...field}
                mode="oneLine"
                value={formatYearMonth(field.value ?? '')}
                onChange={(v) => {
                  field.onChange(formatYearMonth(v));
                  void trigger(field.name);
                }}
                placeholder="202501"
                className="flex-1"
              />
            )}
          />
          <span className="text-foreground-tertiary">-</span>
          <Controller
            control={control}
            name={`careers.${index}.endDate`}
            rules={{
              validate: (value) => {
                if (isWorking) return true;
                if (!value || !value.trim()) return '종료일은 필수에요.';
                return true;
              },
            }}
            render={({ field }) => (
              <TextArea
                {...field}
                mode="oneLine"
                value={isWorking ? '' : formatYearMonth(field.value ?? '')}
                onChange={(v) => {
                  field.onChange(formatYearMonth(v));
                  void trigger(field.name);
                }}
                placeholder={isWorking ? '재직 중' : '202501'}
                isDisabled={isWorking}
                className="flex-1"
              />
            )}
          />
        </div>

        <div className="min-h-[1.25rem] px-10 pt-4">
          {(startErr || endErr) && (
            <span className="text-caption-caption6 text-foreground-danger">
              {startErr ?? endErr}
            </span>
          )}
        </div>
      </FieldGroup>

      <div className="flex w-full justify-end">
        <button
          className="text-body-body8 text-foreground-normal flex h-[2rem] w-[4rem] items-center justify-center"
          onClick={onDelete}
          type="button"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
});
