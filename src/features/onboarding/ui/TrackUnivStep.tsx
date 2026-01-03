'use client';

import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { WheelPicker } from '@/shared/ui/wheel-picker/WheelPicker';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { SelectField } from '@/shared/ui/select-field/SelectField';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { SolidButton } from '@/shared/ui/button/solid-button/SolidButton';
import { useCallback, useState } from 'react';
import {
  ONBOARDING_EVENTS,
  OnBoardingFormData,
  TrackPart,
} from '@/features/onboarding/model/types';
import { formatTrackLabel, mapToApiTrack } from '../lib/trackMapper';
import { trackOnBoardingEvent } from '../lib/trackOnBoardingEvent';

export function TrackUnivStep() {
  const { control, setValue } = useFormContext<OnBoardingFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'tracks',
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempTrack, setTempTrack] = useState<{ generation: number; part: TrackPart } | null>(null);

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

  function handleSelectTrack() {
    if (!tempTrack) return;
    const isDuplicate = isDuplicateTrack(fields, tempTrack, editingIndex);

    if (isDuplicate) {
      // TODO: 이미 선택된 기수 및 파트임을 안내하는 문구 추가
      return;
    }

    if (editingIndex === null) {
      append(tempTrack);
    } else {
      update(editingIndex, tempTrack);
    }
    setTempTrack(null);
    setEditingIndex(null);
    setIsSheetOpen(false);
  }

  const handlePickerChange = useCallback(({ period, part }: { period: string; part: string }) => {
    try {
      const track = mapToApiTrack(period, part);

      setTempTrack((prev) => {
        if (prev?.generation === track.generation && prev?.part === track.part) {
          return prev;
        }
        return track;
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      {/* 기수 및 파트 */}
      <div>
        <FieldGroup title="기수 및 파트" isRequired>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-5">
              <SelectField
                size="l"
                placeholder="기수 및 파트를 선택해주세요"
                selectedValue={
                  field.generation && field.part
                    ? formatTrackLabel(field.generation, field.part)
                    : undefined
                }
                onClick={() => {
                  setEditingIndex(idx);
                  setIsSheetOpen(true);
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
                placeholder="대학교를 입력해주세요."
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
                  placeholder="대학원을 입력해주세요."
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

      {/* 피커 모달 */}
      <ModalSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[360px]">
          <ModalSheet.Content>
            <Sheet>
              <div className="flex flex-col gap-[1.25rem]">
                <WheelPicker initPeriodIdx={0} initPartIdx={0} onChange={handlePickerChange} />
                <SolidButton type="button" size="l" variant="primary" onClick={handleSelectTrack}>
                  선택하기
                </SolidButton>
              </div>
            </Sheet>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onTap={() => setIsSheetOpen(false)} />
      </ModalSheet>
    </>
  );
}
