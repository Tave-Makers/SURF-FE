'use client';

import { TextButton } from '@surf/ui/button';
import { Checkbox } from '@surf/ui/checkbox';
import { FieldGroup } from '@surf/ui/field-group';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextArea } from '@surf/ui/text-area';
import { Toggle } from '@surf/ui/toggle';
import { useRouter } from 'next/navigation';
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Controller,
  FieldValues,
  useFieldArray,
  useForm,
  useWatch,
  type FieldErrors,
  type FieldPath,
} from 'react-hook-form';

import type { CareerForm, FormValues } from '../model/types';
import { CareerItem } from './CareerItem';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { updateMyProfile } from '@/entities/user/api/updateMyProfile.client';
import { normalizeTextString } from '@/entities/user/model/normalize';
import type { DateString, UpdateProfileRequestDTO, UserProfile } from '@/entities/user/model/types';

import { ProfileImageUploader } from '@/features/profile/ui/upload-profile-image/ProfileImageUploader';

import { PAGE_ROUTES } from '@/shared/config/path';
import { useAbortableLifeCycle } from '@/shared/hooks/useAbortableLifeCycle';
import { formatPhoneNumber, isYearMonth, isValidUrl, onlyDigits } from '@/shared/lib/validator';

export interface EditProfileFormHandle {
  submit: () => void;
}

interface Props {
  initialProfile: UserProfile;
  onCanSubmitChange?: (canSubmit: boolean) => void;
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

export const EditProfileForm = forwardRef<EditProfileFormHandle, Props>(
  ({ initialProfile, onCanSubmitChange }, ref) => {
    const router = useRouter();
    const toast = useToastStore((s) => s.show);
    const { isActive, startRequest } = useAbortableLifeCycle();
    const { uploadImages } = useImageUploader();

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
      setValue,
      setFocus,
      clearErrors,
      trigger,
      watch,
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

    const profileImageUrl = useWatch({ control, name: 'profileImageUrl' });
    const hasGraduateSchool = useWatch({ control, name: 'hasGraduateSchool' });
    const currentCareers = watch('careers');

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

    const onDeleteCareer = useCallback(
      (index: number) => {
        const id = currentCareers?.[index]?.careerId;
        if (typeof id === 'number' && id > 0) {
          setCareerIdsToDelete((prev) => (prev.includes(id) ? prev : [...prev, id]));
        }
        remove(index);
      },
      [currentCareers, remove],
    );

    const canSubmit = useMemo(() => {
      const hasAnyChange = isDirty || careerIdsToDelete.length > 0;
      return hasAnyChange && !isSubmitting;
    }, [isDirty, careerIdsToDelete.length, isSubmitting]);

    useEffect(() => {
      onCanSubmitChange?.(canSubmit);
    }, [canSubmit, onCanSubmitChange]);

    const onSubmit = useCallback(
      async (values: FormValues) => {
        const signal = startRequest();
        try {
          const careersToCreate = values.careers
            .filter((c) => c.careerId < 0)
            .map(toCareerCreateDTO);
          const careersToUpdate = values.careers
            .filter((c) => c.careerId > 0)
            .map(toCareerUpdateDTO);

          const payload: UpdateProfileRequestDTO = {
            email: normalizeTextString(values.email),
            university: normalizeTextString(values.university),
            graduateSchool: values.hasGraduateSchool
              ? normalizeTextString(values.graduateSchool)
              : '',
            selfIntroduction: normalizeTextString(values.selfIntroduction),
            link: normalizeTextString(values.link),
            phoneNumber: values.phoneNumber,
            phoneNumberPublic: values.phoneNumberPublic,
            isProfileImageChanged: false,
            careersToCreate: careersToCreate.length ? careersToCreate : null,
            careersToUpdate: careersToUpdate.length ? careersToUpdate : null,
            careerIdsToDelete: careerIdsToDelete.length ? careerIdsToDelete : null,
          };

          if (values.profileImage) {
            const [result] = await uploadImages([
              { id: 'profile', file: values.profileImage, preview: '', status: 'pending' },
            ]);
            if (!isActive()) return;
            if (result.status !== 'uploaded' || !result.uploadedUrl) {
              toast('프로필 이미지 업로드에 실패했습니다.');
              return;
            }
            payload.isProfileImageChanged = true;
            payload.profileImageUrl = result.uploadedUrl;
          }

          await updateMyProfile(payload, signal);
          if (!isActive()) return;
          toast('정보 수정이 완료되었습니다.', 1000);
          router.replace(PAGE_ROUTES.MYPAGE.MAIN);
          router.refresh();
        } catch (e: unknown) {
          if (!isActive()) return;
          console.error(e);
          toast(e instanceof Error ? e.message : '프로필 수정 중 오류가 발생했습니다.');
        }
      },
      [careerIdsToDelete, uploadImages, toast, router, startRequest, isActive],
    );

    const onInvalid = useCallback(() => {
      const first = findFirstErrorPath<FormValues>(errors);
      if (first) {
        setFocus(first);
        requestAnimationFrame(() => {
          document.getElementById(first)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    }, [errors, setFocus]);

    const handleProfileImageChange = useCallback(
      (file: File) => {
        setValue('profileImage', file, { shouldDirty: true });
        void trigger('profileImage');
      },
      [setValue, trigger],
    );

    useImperativeHandle(ref, () => ({
      submit: () => void handleSubmit(onSubmit, onInvalid)(),
    }));

    return (
      <form onSubmit={(e) => e.preventDefault()} aria-label="프로필 편집 폼">
        <div className="flex items-center justify-center gap-10 self-stretch pt-19 pb-10">
          <Controller
            name="profileImage"
            control={control}
            render={({ field }) => (
              <ProfileImageUploader
                file={field.value}
                onChange={handleProfileImageChange}
                initialImageUrl={profileImageUrl}
                imageSize="l"
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
                  {...field}
                  mode="multiLine"
                  textLimit={60}
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
                validate: (value) =>
                  !value || !value.trim() || isValidUrl(value) || 'URL 형식이 올바르지 않아요.',
              }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  mode="oneLine"
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
                  {...field}
                  mode="oneLine"
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
                pattern: { value: /^01[0-9]\d{7,8}$/, message: '숫자만 10~11자리로 입력해주세요.' },
              }}
              render={({ field }) => (
                <TextArea
                  id={field.name}
                  mode="oneLine"
                  value={formatPhoneNumber(field.value ?? '')}
                  onChange={(v) => field.onChange(onlyDigits(v))}
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
                    {...field}
                    mode="oneLine"
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
                      {...field}
                      mode="oneLine"
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
                      if (!checked) setValue('graduateSchool', '', { shouldDirty: true });
                    }}
                  />
                )}
              />
            </div>
          </FieldGroup>

          <div className="flex flex-col gap-16">
            {fields.map((f, index) => (
              <CareerItem
                key={f.rhfId}
                index={index}
                control={control}
                errors={errors}
                setValue={setValue}
                clearErrors={clearErrors}
                trigger={trigger}
                onDelete={() => onDeleteCareer(index)}
              />
            ))}
          </div>

          <TextButton
            size="m"
            variant="secondary"
            onClick={onAddCareer}
            className="border-border-quaternary border"
            type="button"
          >
            경력 추가하기
          </TextButton>
        </div>
      </form>
    );
  },
);
EditProfileForm.displayName = 'EditProfileForm';
