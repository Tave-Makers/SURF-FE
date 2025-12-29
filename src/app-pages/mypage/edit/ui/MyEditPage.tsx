'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import type { DateString, UpdateProfileRequestDTO, UserProfile } from '@/entities/user/model/types';
import { updateMyProfile } from '@/entities/user/api/updateMyProfile.client';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { Toggle } from '@/shared/ui/toggle/Toggle';
import { TextButton } from '@/shared/ui/button/text-button/TextButton';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';

interface Props {
  initialProfile: UserProfile;
}

type CareerForm = {
  careerId: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isWorking: boolean;
};

type FormValues = {
  selfIntroduction: string;
  link: string;
  email: string;
  phoneNumber: string;
  phoneNumberPublic: boolean;
  university: string;
  hasGraduateSchool: boolean;
  graduateSchool: string;

  careers: CareerForm[];
};

function makeTempCareerId() {
  return -Date.now();
}

function isDateString(value: string): value is DateString {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeLink(v: string) {
  const trimmed = v.trim();
  if (!trimmed) return null;
  return trimmed;
}

function toCareerCreateDTO(c: CareerForm) {
  return {
    companyName: c.companyName.trim(),
    position: c.position.trim(),
    startDate: c.startDate as DateString,
    endDate: c.isWorking ? null : ((c.endDate || null) as DateString | null),
    isWorking: c.isWorking,
  };
}

function toCareerUpdateDTO(c: CareerForm) {
  return {
    careerId: c.careerId,
    companyName: c.companyName.trim(),
    position: c.position.trim(),
    startDate: c.startDate as DateString,
    endDate: c.isWorking ? null : ((c.endDate || null) as DateString | null),
    isWorking: c.isWorking,
  };
}

export default function MyEditPage({ initialProfile }: Props) {
  const router = useRouter();

  const defaultCareers: CareerForm[] = useMemo(() => {
    const src = initialProfile.careers ?? [];
    return src.map((c) => ({
      careerId: c.careerId,
      companyName: c.companyName ?? '',
      position: c.position ?? '',
      startDate: String(c.startDate ?? ''),
      endDate: String(c.endDate ?? ''),
      isWorking: !!c.isWorking,
    }));
  }, [initialProfile.careers]);

  const [careerIdsToDelete, setCareerIdsToDelete] = useState<number[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValid, errors, dirtyFields },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      selfIntroduction: initialProfile.selfIntroduction ?? '',
      link: initialProfile.link ?? '',
      email: initialProfile.email ?? '',
      phoneNumber: initialProfile.phoneNumber ?? '',
      phoneNumberPublic: !!initialProfile.phoneNumberPublic,
      university: initialProfile.university ?? '',

      hasGraduateSchool: !!initialProfile.graduateSchool,
      graduateSchool: initialProfile.graduateSchool ?? '',

      careers: defaultCareers,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'careers',
    keyName: 'rhfId',
  });

  const careers = watch('careers');
  const hasGraduateSchool = watch('hasGraduateSchool');

  const onAddCareer = () => {
    append({
      careerId: makeTempCareerId(),
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      isWorking: false,
    });
  };

  const onDeleteCareer = (index: number) => {
    const id = careers?.[index]?.careerId;
    if (typeof id === 'number' && id > 0) {
      setCareerIdsToDelete((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
    remove(index);
  };

  const canSubmit = useMemo(() => {
    const hasAnyDirty = Object.keys(dirtyFields ?? {}).length > 0 || careerIdsToDelete.length > 0;
    return isValid && hasAnyDirty && !isSubmitting;
  }, [isValid, dirtyFields, careerIdsToDelete.length, isSubmitting]);

  const onSubmit = async (values: FormValues) => {
    for (const c of values.careers) {
      if (!isDateString(c.startDate)) {
        alert('시작일은 YYYY-MM-DD 형식으로 입력해주세요.');
        return;
      }
      if (!c.isWorking && c.endDate && !isDateString(c.endDate)) {
        alert('종료일은 YYYY-MM-DD 형식으로 입력해주세요.');
        return;
      }
    }

    const careersToCreate = values.careers.filter((c) => c.careerId < 0).map(toCareerCreateDTO);
    const careersToUpdate = values.careers.filter((c) => c.careerId > 0).map(toCareerUpdateDTO);

    const payload: UpdateProfileRequestDTO = {
      email: values.email.trim(),
      university: values.university.trim(),
      graduateSchool: values.hasGraduateSchool ? values.graduateSchool.trim() : undefined,
      selfIntroduction: values.selfIntroduction.trim(),
      link: normalizeLink(values.link),
      phoneNumber: values.phoneNumber.trim(),
      phoneNumberPublic: values.phoneNumberPublic,
      careersToCreate: careersToCreate.length ? careersToCreate : null,
      careersToUpdate: careersToUpdate.length ? careersToUpdate : null,
      careerIdsToDelete: careerIdsToDelete.length ? careerIdsToDelete : null,
    };

    try {
      await updateMyProfile(payload);
      router.refresh();
      router.back();
    } catch (e) {
      console.error(e);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: '프로필 수정',
          hasLeftIcon: true,
          text: '저장',
          btnVariant: 'secondary',
          isDisabled: !canSubmit,
          onClickTextBtn: () => void handleSubmit(onSubmit)(),
        }}
      />

      <div className="flex flex-col gap-16 px-13 pb-16">
        <FieldGroup title="자기소개">
          <Controller
            control={control}
            name="selfIntroduction"
            rules={{ maxLength: { value: 60, message: '최대 60자까지 입력할 수 있어요.' } }}
            render={({ field }) => (
              <TextArea
                mode="multiLine"
                textLimit={60}
                value={field.value}
                onChange={field.onChange}
                placeholder="자기소개를 입력해주세요"
                errorMessage={errors.selfIntroduction?.message}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup title="링크">
          <Controller
            control={control}
            name="link"
            render={({ field }) => (
              <TextArea
                mode="oneLine"
                value={field.value}
                onChange={field.onChange}
                placeholder="블로그, 포트폴리오 등 링크"
              />
            )}
          />
        </FieldGroup>

        <FieldGroup title="이메일" isRequired>
          <Controller
            control={control}
            name="email"
            rules={{
              required: '이메일은 필수예요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 형식이 아니에요.',
              },
            }}
            render={({ field }) => (
              <TextArea
                mode="oneLine"
                value={field.value}
                onChange={field.onChange}
                placeholder="email@example.com"
                errorMessage={errors.email?.message}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup
          title="전화번호"
          isRequired
          headerRight={
            <Controller
              control={control}
              name="phoneNumberPublic"
              render={({ field }) => (
                <Toggle isChecked={field.value} onChange={(checked) => field.onChange(checked)} />
              )}
            />
          }
        >
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: '전화번호는 필수예요.',
              pattern: {
                value: /^[0-9-]+$/,
                message: '전화번호 형식이 올바르지 않아요.',
              },
            }}
            render={({ field }) => (
              <TextArea
                mode="oneLine"
                value={field.value}
                onChange={field.onChange}
                placeholder="010-0000-0000"
                errorMessage={errors.phoneNumber?.message}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup title="학교" isRequired>
          <div className="flex flex-col gap-8">
            <Controller
              control={control}
              name="university"
              rules={{ required: '학교는 필수예요.' }}
              render={({ field }) => (
                <TextArea
                  mode="oneLine"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="학교"
                  errorMessage={errors.university?.message}
                />
              )}
            />
            {hasGraduateSchool && (
              <Controller
                control={control}
                name="graduateSchool"
                rules={{ required: '대학원을 입력해주세요.' }}
                render={({ field }) => (
                  <TextArea
                    mode="oneLine"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="대학원"
                    errorMessage={errors.graduateSchool?.message}
                  />
                )}
              />
            )}
            <Controller
              control={control}
              name="hasGraduateSchool"
              render={({ field }) => (
                <Checkbox
                  label="대학원 입력"
                  isChecked={field.value}
                  onChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) setValue('graduateSchool', '');
                  }}
                />
              )}
            />
          </div>
        </FieldGroup>

        <div className="flex flex-col gap-16">
          {fields.map((f, index) => {
            const isWorking = careers?.[index]?.isWorking ?? false;

            return (
              <div key={f.rhfId} className="flex w-full flex-col gap-16">
                <FieldGroup title={`회사명 ${index + 1}`}>
                  <Controller
                    control={control}
                    name={`careers.${index}.companyName`}
                    rules={{ required: '회사명은 필수예요.' }}
                    render={({ field }) => (
                      <TextArea
                        mode="oneLine"
                        value={field.value}
                        onChange={field.onChange}
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
                    rules={{ required: '직책은 필수예요.' }}
                    render={({ field }) => (
                      <TextArea
                        mode="oneLine"
                        value={field.value}
                        onChange={field.onChange}
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
                            if (checked) setValue(`careers.${index}.endDate`, '');
                          }}
                        />
                      )}
                    />
                  }
                >
                  <div className="flex items-center gap-4">
                    <Controller
                      control={control}
                      name={`careers.${index}.startDate`}
                      rules={{
                        required: '시작일은 필수예요.',
                        validate: (v) => isDateString(v) || 'YYYY-MM-DD 형식으로 입력해주세요.',
                      }}
                      render={({ field }) => (
                        <TextArea
                          mode="oneLine"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="2025-12-29"
                          className="flex-1"
                        />
                      )}
                    />

                    <span className="text-foreground-tertiary">-</span>

                    <Controller
                      control={control}
                      name={`careers.${index}.endDate`}
                      rules={{
                        validate: (v, all) => {
                          const w = all.careers?.[index]?.isWorking;
                          if (w) return true;
                          if (!v) return true;
                          return isDateString(v) || 'YYYY-MM-DD 형식으로 입력해주세요.';
                        },
                      }}
                      render={({ field }) => (
                        <TextArea
                          mode="oneLine"
                          value={isWorking ? '' : field.value}
                          onChange={field.onChange}
                          placeholder={isWorking ? '재직 중' : '2025-12-29'}
                          isDisabled={isWorking}
                          className="flex-1"
                        />
                      )}
                    />
                  </div>
                </FieldGroup>

                <button className="flex w-full justify-end" onClick={() => onDeleteCareer(index)}>
                  <span
                    className="text-body-body8 text-foreground-normal"
                    role="button"
                    tabIndex={0}
                  >
                    삭제하기
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <TextButton
          size="m"
          variant="secondary"
          onClick={onAddCareer}
          className="border-border-quaternary border"
        >
          경력 추가하기
        </TextButton>
      </div>
    </div>
  );
}
