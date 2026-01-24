'use client';

import { SolidButton } from '@surf/ui/button';
import { Checkbox } from '@surf/ui/checkbox';
import { FieldGroup } from '@surf/ui/field-group';
import { SurfIcon } from '@surf/ui/icon';
import { SelectField } from '@surf/ui/select-field';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextArea } from '@surf/ui/text-area';
import { useState } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { formatTrackLabel } from '../lib/trackMapper';
import { trackOnBoardingEvent } from '../lib/trackOnBoardingEvent';
import { TrackPart } from '@/entities/user/model/types';
import { ONBOARDING_EVENTS, OnBoardingFormData } from '@/features/onboarding/model/types';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

export const TrackUnivStep = () => {
  const { control, setValue } = useFormContext<OnBoardingFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'tracks',
  });
  const watchedTracks = useWatch({ control, name: 'tracks' }) ?? [];

  const [_editingIndex, setEditingIndex] = useState<number | null>(null);
  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);

  const [isGraduateStudent, setIsGraduateStudent] = useState(false);

  function isDuplicateTrack(
    tracks: { generation: number | null; part: TrackPart | null }[],
    target: { generation: number; part: TrackPart },
    editingIndex: number | null,
  ) {
    return tracks.some((t, idx) => {
      if (editingIndex !== null && idx === editingIndex) return false;
      return t.generation === target.generation && t.part === target.part;
    });
  }

  function isDuplicateGeneration(
    tracks: { generation: number | null; part: TrackPart | null }[],
    target: { generation: number; part: TrackPart },
    editingIndex: number | null,
  ) {
    return tracks.some((t, idx) => {
      if (editingIndex !== null && idx === editingIndex) return false;
      return t.generation === target.generation && t.part !== target.part;
    });
  }

  function openTrackPicker(index: number) {
    setEditingIndex(index);
    openBottomSheet({
      type: 'trackPicker',
      props: {
        onSelect: (selectedTrack) => {
          const isDuplicate = isDuplicateTrack(watchedTracks, selectedTrack, index);
          if (isDuplicate) {
            showToast('이미 선택된 기수 및 파트입니다.');
            return;
          }
          const isDuplicateGen = isDuplicateGeneration(watchedTracks, selectedTrack, index);
          if (isDuplicateGen) {
            showToast('동일 기수는 하나의 파트만 선택할 수 있어요.');
            return;
          }
          update(index, selectedTrack);
          setEditingIndex(null);
          closeBottomSheet();
        },
      },
    });
  }

  return (
    <>
      {/* 기수 및 파트 */}
      <div>
        <FieldGroup title="기수 및 파트" isRequired>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-5">
              <SelectField
                size="l"
                placeholder="기수 및 파트를 선택해주세요."
                selectedValue={
                  field.generation && field.part
                    ? formatTrackLabel(field.generation, field.part)
                    : undefined
                }
                onClick={() => {
                  openTrackPicker(idx);
                }}
              />

              {fields.length > 1 && (
                <button
                  onClick={() => remove(idx)}
                  className="flex h-[2.5rem] w-[2.5rem] items-center justify-center"
                >
                  <SurfIcon size="l" name="TrashOne" />
                </button>
              )}
            </div>
          ))}
        </FieldGroup>
        {/* 추가 버튼 */}
        {fields.every((t) => t.generation && t.part) && (
          <SolidButton
            size="s"
            variant="secondary"
            onClick={() => append({ generation: null, part: null })}
            className="my-10"
          >
            추가하기
          </SolidButton>
        )}
      </div>

      {/* 대학교 및 대학원 */}
      <div className="flex flex-col gap-3">
        <FieldGroup title="대학교" isRequired>
          <Controller
            name="university"
            control={control}
            rules={{ required: '대학교는 필수 입력값입니다.' }}
            render={({ field, fieldState }) => (
              <TextArea
                {...field}
                onBlur={(_e) => {
                  trackOnBoardingEvent(ONBOARDING_EVENTS.INPUT_SIGNUP_FIELD, {
                    field_name: 'university',
                  });
                  field.onBlur();
                }}
                value={field.value || ''}
                errorMessage={fieldState.error?.message}
                placeholder="대학교를 공식 학교명으로 입력해주세요."
              />
            )}
          />
          {isGraduateStudent && (
            <Controller
              name="graduateSchool"
              control={control}
              render={({ field, fieldState }) => (
                <TextArea
                  {...field}
                  value={field.value || ''}
                  errorMessage={fieldState.error?.message}
                  placeholder="대학원을 공식 학교명으로 입력해주세요."
                />
              )}
            />
          )}
        </FieldGroup>
        <Checkbox
          label="대학원"
          onChange={(e) => {
            const checked = e.target.checked;
            setIsGraduateStudent(checked);
            if (!checked) setValue('graduateSchool', '');
          }}
          isChecked={isGraduateStudent}
        />
      </div>
    </>
  );
};
