'use client';

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  Controller,
  FieldValues,
  useFieldArray,
  useForm,
  useWatch,
  type FieldErrors,
  type FieldPath,
} from 'react-hook-form';

import type { DateString, UpdateProfileRequestDTO, UserProfile } from '@/entities/user/model/types';
import { updateMyProfile } from '@/entities/user/api/updateMyProfile.client';

import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { Toggle } from '@/shared/ui/toggle/Toggle';
import { TextButton } from '@/shared/ui/button/text-button/TextButton';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';

import { ProfileImageUploader } from '@/features/profile/ui/upload-profile-image/ProfileImageUploader';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import type { UploadImage } from '@/entities/image/model/types';

import {
  formatPhoneNumber,
  formatYearMonth,
  isYearMonth,
  isValidUrl,
  onlyDigits,
} from '@/shared/lib/validator';
import { normalizeTextString } from '@/entities/user/model/normalize';
import { useToastStore } from '@/shared/store/toastStore';
import { useAbortableLifeCycle } from '@/shared/hooks/useAbortableLifeCycle';

export type EditProfileFormHandle = {
  submit: () => void;
};

type Props = {
  initialProfile: UserProfile;
  onCanSubmitChange?: (canSubmit: boolean) => void;
};

interface CareerForm {
  careerId: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isWorking: boolean;
}

interface FormValues {
  profileImage?: File;
  profileImageUrl?: string;
  selfIntroduction: string;
  link: string;
  email: string;
  phoneNumber: string;
  phoneNumberPublic: boolean;
  university: string;
  hasGraduateSchool: boolean;
  graduateSchool: string;
  careers: CareerForm[];
}

function toLocalDateOrNull(value: string): DateString | null {
  const t = value.trim();
  if (!t) return null;
  if (!isYearMonth(t)) return null;
  return `${t}-01` as DateString;
}

function toCareerCreateDTO(c: CareerForm) {
  const start = toLocalDateOrNull(c.startDate);
  if (!start) throw new Error(`시작일 형식이 올바르지 않아요.`);

  const end = c.isWorking ? null : toLocalDateOrNull(c.endDate);

  return {
    companyName: c.companyName.trim(),
    position: c.position.trim(),
    startDate: start,
    endDate: end,
    isWorking: c.isWorking,
  };
}

function toCareerUpdateDTO(c: CareerForm) {
  const start = toLocalDateOrNull(c.startDate);
  if (!start) throw new Error(`시작일 형식이 올바르지 않아요.`);

  const end = c.isWorking ? null : toLocalDateOrNull(c.endDate);

  return {
    careerId: c.careerId,
    companyName: c.companyName.trim(),
    position: c.position.trim(),
    startDate: start,
    endDate: end,
    isWorking: c.isWorking,
  };
}

function findFirstErrorPath<TFieldValues extends FieldValues>(
  err: FieldErrors<TFieldValues>,
): FieldPath<TFieldValues> | null {
  const walk = (node: unknown, base = ''): string | null => {
    if (!node || typeof node !== 'object') return null;

    if ('message' in node && typeof (node as { message?: unknown }).message === 'string') {
      return base || null;
    }

    for (const key of Object.keys(node)) {
      const nextBase = base ? `${base}.${key}` : key;
      const child = (node as Record<string, unknown>)[key];
      const found = walk(child, nextBase);
      if (found) return found;
    }
    return null;
  };

  const path = walk(err);
  return path ? (path as FieldPath<TFieldValues>) : null;
}

export const EditProfileForm = forwardRef<EditProfileFormHandle, Props>(function EditProfileForm(
  { initialProfile, onCanSubmitChange },
  ref,
) {
  const router = useRouter();
  const toast = useToastStore((s) => s.show);
  const { isAlive, getSignal } = useAbortableLifeCycle();

  const { uploadImages } = useImageUploader();

  // 새로 만든 career의 임시 id
  const tempCareerIdCounter = useRef(0);
  const makeTempCareerId = () => -++tempCareerIdCounter.current;

  const defaultCareers: CareerForm[] = useMemo(() => {
    const src = initialProfile.careers ?? [];
    return src.map((c) => ({
      careerId: c.careerId,
      companyName: c.companyName ?? '',
      position: c.position ?? '',
      startDate: String(c.startDate ?? '').slice(0, 7),
      endDate: String(c.endDate ?? '').slice(0, 7),
      isWorking: !!c.isWorking,
    }));
  }, [initialProfile.careers]);

  const [careerIdsToDelete, setCareerIdsToDelete] = useState<number[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    trigger,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      profileImage: undefined,
      profileImageUrl: initialProfile.profileImgUrl ?? '',
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

  const careers = watch('careers');
  const profileImageUrl = useWatch({ control, name: 'profileImageUrl' });
  const hasGraduateSchool = watch('hasGraduateSchool');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'careers',
    keyName: 'rhfId',
  });

  const onAddCareer = () =>
    append({
      careerId: makeTempCareerId(),
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      isWorking: false,
    });

  const onDeleteCareer = (index: number) => {
    const id = careers?.[index]?.careerId;
    if (typeof id === 'number' && id > 0) {
      setCareerIdsToDelete((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
    remove(index);
  };

  const canSubmit = useMemo(() => {
    const hasAnyChange = isDirty || careerIdsToDelete.length > 0;
    return hasAnyChange && !isSubmitting;
  }, [isDirty, careerIdsToDelete.length, isSubmitting]);

  useEffect(() => {
    onCanSubmitChange?.(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const signal = getSignal();

      try {
        const careersToCreate = values.careers.filter((c) => c.careerId < 0).map(toCareerCreateDTO);
        const careersToUpdate = values.careers.filter((c) => c.careerId > 0).map(toCareerUpdateDTO);

        const payload: UpdateProfileRequestDTO = {
          email: normalizeTextString(values.email),
          university: normalizeTextString(values.university),
          graduateSchool: values.hasGraduateSchool
            ? normalizeTextString(values.graduateSchool)
            : undefined,

          selfIntroduction: normalizeTextString(values.selfIntroduction),
          link: normalizeTextString(values.link),
          phoneNumber: values.phoneNumber,
          phoneNumberPublic: values.phoneNumberPublic,

          isProfileImageChanged: false,
          profileImageUrl: undefined,

          careersToCreate: careersToCreate.length ? careersToCreate : null,
          careersToUpdate: careersToUpdate.length ? careersToUpdate : null,
          careerIdsToDelete: careerIdsToDelete.length ? careerIdsToDelete : null,
        };

        if (values.profileImage) {
          const uploadTarget: UploadImage = {
            id: 'profile',
            file: values.profileImage,
            preview: '',
            status: 'pending',
          };

          const [result] = await uploadImages([uploadTarget]);

          if (!isAlive()) return;

          if (result.status !== 'uploaded' || !result.uploadedUrl) {
            toast('프로필 이미지 업로드에 실패했습니다.');
            return;
          }

          payload.isProfileImageChanged = true;
          payload.profileImageUrl = result.uploadedUrl;
        }

        await updateMyProfile(payload, signal);

        if (!isAlive()) return;

        toast('정보 수정이 완료되었습니다.', 1500);
        router.replace('/mypage');
        router.refresh();
      } catch (e: unknown) {
        const error =
          typeof e === 'object' && e !== null
            ? (e as { name?: unknown; code?: unknown; message?: unknown })
            : {};

        const aborted =
          error.name === 'CanceledError' ||
          error.code === 'ERR_CANCELED' ||
          (typeof error.message === 'string' &&
            (error.message.includes('canceled') || error.message.includes('aborted')));

        if (aborted || !isAlive()) return;

        console.error(e);
        toast(e instanceof Error ? e.message : '프로필 수정 중 오류가 발생했습니다.');
      }
    },
    [careerIdsToDelete, uploadImages, toast, router, getSignal, isAlive],
  );

  const onInvalid = useCallback(() => {
    const first = findFirstErrorPath<FormValues>(errors);
    if (!first) return;

    setFocus(first);

    requestAnimationFrame(() => {
      document.getElementById(first)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [errors, setFocus]);

  useImperativeHandle(
    ref,
    () => ({
      submit: () => void handleSubmit(onSubmit, onInvalid)(),
    }),
    [handleSubmit, onInvalid, onSubmit],
  );

  return (
    <div>
      <div className="flex items-center justify-center gap-10 self-stretch pt-19 pb-10">
        <Controller
          name="profileImage"
          control={control}
          render={({ field }) => (
            <ProfileImageUploader
              file={field.value}
              onChange={(file) => {
                field.onChange(file);
                void trigger('profileImage');
              }}
              initialImageUrl={profileImageUrl}
              aria-label="프로필 이미지 변경"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-16 px-13 pb-16">
        <FieldGroup title="자기소개">
          <Controller
            control={control}
            name="selfIntroduction"
            rules={{ maxLength: { value: 60, message: '최대 60자까지 입력할 수 있어요.' } }}
            render={({ field }) => (
              <TextArea
                id={field.name}
                mode="multiLine"
                textLimit={60}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="자기소개를 입력해주세요."
                errorMessage={errors.selfIntroduction?.message}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup title="링크">
          <Controller
            control={control}
            name="link"
            rules={{
              validate: (value) => {
                if (!value || !value.trim()) return true;
                return isValidUrl(value) || 'URL 형식이 올바르지 않아요.';
              },
            }}
            render={({ field }) => (
              <TextArea
                id={field.name}
                mode="oneLine"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="블로그, 포트폴리오 등 링크"
                errorMessage={errors.link?.message}
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
                message: '올바른 이메일을 입력해주세요.',
              },
            }}
            render={({ field }) => (
              <TextArea
                id={field.name}
                mode="oneLine"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
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
              required: '전화번호는 필수에요.',
              pattern: {
                value: /^01[0-9]\d{7,8}$/,
                message: '숫자만 10~11자리로 입력해주세요.',
              },
            }}
            render={({ field }) => (
              <TextArea
                id={field.name}
                mode="oneLine"
                value={formatPhoneNumber(field.value ?? '')}
                onChange={(value: string) => {
                  const digits = onlyDigits(value);
                  field.onChange(digits);
                }}
                onBlur={field.onBlur}
                placeholder="01012345678"
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
              rules={{ required: '학교는 필수에요.' }}
              render={({ field }) => (
                <TextArea
                  id={field.name}
                  mode="oneLine"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
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
                    id={field.name}
                    mode="oneLine"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
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
                    if (!checked) {
                      setValue('graduateSchool', '', { shouldDirty: true, shouldValidate: true });
                    }
                  }}
                />
              )}
            />
          </div>
        </FieldGroup>

        <div className="flex flex-col gap-16">
          {fields.map((f, index) => {
            const isWorking = careers?.[index]?.isWorking ?? false;

            const startErr = errors.careers?.[index]?.startDate?.message;
            const endErr = errors.careers?.[index]?.endDate?.message;

            return (
              <div key={f.rhfId} className="flex w-full flex-col gap-16">
                <FieldGroup title={`회사명 ${index + 1}`}>
                  <Controller
                    control={control}
                    name={`careers.${index}.companyName`}
                    rules={{ required: '회사명은 필수에요.' }}
                    render={({ field }) => (
                      <TextArea
                        id={field.name}
                        mode="oneLine"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
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
                        id={field.name}
                        mode="oneLine"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
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
                              setValue(`careers.${index}.endDate`, '', {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              void trigger([`careers.${index}.endDate`]);
                            }
                          }}
                        />
                      )}
                    />
                  }
                >
                  <div className="flex flex-row items-center gap-4">
                    <Controller
                      control={control}
                      name={`careers.${index}.startDate`}
                      rules={{
                        required: '시작일은 필수에요.',
                      }}
                      render={({ field }) => (
                        <TextArea
                          id={field.name}
                          mode="oneLine"
                          value={formatYearMonth(field.value ?? '')}
                          onChange={(v) => {
                            field.onChange(formatYearMonth(v));
                            void trigger(field.name);
                          }}
                          onBlur={field.onBlur}
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
                          id={field.name}
                          mode="oneLine"
                          value={isWorking ? '' : formatYearMonth(field.value ?? '')}
                          onChange={(v) => {
                            field.onChange(formatYearMonth(v));
                            void trigger(field.name);
                          }}
                          onBlur={field.onBlur}
                          placeholder={isWorking ? '재직 중' : '202501'}
                          isDisabled={isWorking}
                          className="flex-1"
                        />
                      )}
                    />
                  </div>

                  {(startErr || endErr) && (
                    <div className="px-10">
                      <span className="text-caption-caption6 text-foreground-danger">
                        {startErr ?? endErr}
                      </span>
                    </div>
                  )}
                </FieldGroup>

                <div className="flex w-full justify-end">
                  <button
                    className="text-body-body8 text-foreground-normal flex h-[2rem] w-[4rem] items-center justify-center"
                    onClick={() => onDeleteCareer(index)}
                    tabIndex={0}
                    type="button"
                    aria-label={`경력 ${index + 1} 삭제`}
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <TextButton
          size="m"
          variant="secondary"
          onClick={onAddCareer}
          className="border-border-quaternary border"
          type="button"
          aria-label="경력 추가하기"
        >
          경력 추가하기
        </TextButton>
      </div>
    </div>
  );
});
