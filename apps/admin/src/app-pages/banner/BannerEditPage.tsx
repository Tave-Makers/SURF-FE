'use client';

import { useKeyboardOffset } from '@surf/hooks';
import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { Header, HeaderMode } from '@surf/ui/header';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextArea } from '@surf/ui/text-area';
import { Toggle } from '@surf/ui/toggle';
import { safeUUID } from '@surf/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UploadImage } from '@/entities/image/model/types';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { ImgUploader } from '@/features/image/ui/ImgUploader';
import { PAGE_ROUTES } from '@/shared/config/path';

interface BannerEditPageProps {
  bannerId: string;
}

interface BannerDetail {
  id: number;
  imageUrl: string;
  name: string;
  linkUrl: string;
  isActive: boolean;
}

interface BannerForm {
  imageUrl: string;
  name: string;
  linkUrl: string;
  isActive: boolean;
}

export const BannerEditPage = ({ bannerId }: BannerEditPageProps) => {
  const router = useRouter();
  const keyboardOffset = useKeyboardOffset();

  const { uploadImages } = useImageUploader();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 서버에서 가져온 초기 데이터 (추후 API로 대체)
  const [initial, setInitial] = useState<BannerDetail | null>(null);

  // 폼 상태
  const [form, setForm] = useState<BannerForm>({
    imageUrl: '',
    name: '',
    linkUrl:
      'https://tavesurf-dev01.s3.ap-northeast-2.amazonaws.com/original/c287aebd-9473-4d21-8221-135cc04f6d90/9e27b8be-5347-4cc6-98ae-462d26cc807d.png',
    isActive: true,
  });

  // 변경된 파일만 저장
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const setField = useCallback(<K extends keyof BannerForm>(key: K, value: BannerForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 배너 단건 조회
  useEffect(() => {
    // TODO: getBannerDetail(bannerId)
    const mock: BannerDetail = {
      id: parseInt(bannerId),
      imageUrl:
        'https://tavesurf-dev01.s3.ap-northeast-2.amazonaws.com/original/c287aebd-9473-4d21-8221-135cc04f6d90/9e27b8be-5347-4cc6-98ae-462d26cc807d.png',
      name: '기존 배너명',
      linkUrl: 'https://example.com',
      isActive: true,
    };
    setInitial(mock);
    setForm({
      imageUrl: mock.imageUrl,
      name: mock.name,
      linkUrl: mock.linkUrl,
      isActive: mock.isActive,
    });
  }, [bannerId]);

  const isChanged = useMemo(() => {
    if (!initial) return false;

    const isActiveChanged = initial.isActive !== form.isActive;

    const textChanged = initial.name !== form.name || initial.linkUrl !== form.linkUrl;

    const imageChanged = bannerFile !== null;

    return textChanged || imageChanged || isActiveChanged;
  }, [initial, form, bannerFile]);

  const canSubmit = useMemo(() => {
    if (!initial) return false;

    const isValid =
      form.name.trim().length > 0 &&
      form.linkUrl.trim().length > 0 &&
      form.imageUrl.trim().length > 0;

    return isValid && isChanged;
  }, [initial, form, isChanged]);

  const handleSubmit = useCallback(async () => {
    if (!initial) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // let imageUrl = form.imageUrl;

      // 이미지 변경 시 저장 시점에만 업로드
      if (bannerFile) {
        const uploadItem: UploadImage = {
          id: safeUUID(),
          file: bannerFile,
          preview: '',
          status: 'pending',
        };

        const [result] = await uploadImages([uploadItem]);

        if (result.status !== 'uploaded' || !result.uploadedUrl) {
          showToast('이미지 업로드에 실패했습니다.');
          return;
        }

        // imageUrl = result.uploadedUrl;
      }

      // TODO: await updateBanner(bannerId, { ...form, imageUrl });

      showToast('배너가 수정되었습니다.');
      router.replace(PAGE_ROUTES.BANNER.LIST);
    } finally {
      setIsSubmitting(false);
    }
  }, [initial, isSubmitting, form, bannerFile, uploadImages, showToast, router, bannerId]);

  const handleOpenSaveAlert = () => {
    openAlert({
      state: 'default',
      title: '수정하시겠습니까?',
      infoText: '수정하기 버튼을 누를 시, 수정된 내용이 SURF의 홈 화면에 반영됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: () => closeAlert() },
        {
          type: 'solid',
          variant: 'primary',
          label: '수정하기',
          onClick: () => {
            closeAlert();
            void handleSubmit();
          },
        },
      ],
    });
  };

  const handleOpenDeleteAlert = () => {
    openAlert({
      state: 'default',
      title: '정말 삭제하시겠습니까?',
      infoText:
        '삭제하기 버튼을 누를 시, 배너 리스트에서 해당 배너 데이터가 영구적으로 삭제됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: () => closeAlert() },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제하기',
          onClick: () => {
            closeAlert();
          },
        },
      ],
    });
  };

  if (!initial) return null; // 로딩 UI

  return (
    <>
      <Header
        mode={HeaderMode.Default}
        title="배너 수정"
        hasLeftIcon
        onClickBack={() => router.back()}
      />
      <div className="border-border-normal flex min-h-screen flex-col border-t-[0.4px] pt-11">
        <div className="flex flex-1 flex-col gap-[1.125rem] px-14">
          <div className="flex items-center justify-between">
            <FieldGroup title="배너 활성화" isRequired>
              <></>
            </FieldGroup>
            <Toggle
              isChecked={form.isActive}
              onChange={(checked) => setField('isActive', checked)}
            />
          </div>

          <FieldGroup title="배너 이미지 등록" isRequired>
            <ImgUploader
              mode="edit"
              value={form.imageUrl}
              overlayText="해당 이미지 클릭 시, 이미지 변경이 가능합니다"
              onSelectFile={(file) => setBannerFile(file)}
              isDisabled={isSubmitting}
            />
          </FieldGroup>

          <FieldGroup title="배너 이름" isRequired>
            <TextArea value={form.name} onChange={(v) => setField('name', v)} />
          </FieldGroup>

          <FieldGroup title="URL" isRequired>
            <TextArea value={form.linkUrl} onChange={(v) => setField('linkUrl', v)} />
          </FieldGroup>
          <SolidButton size="m" variant="warning" className="mt-20" onClick={handleOpenDeleteAlert}>
            해당 배너 삭제하기
          </SolidButton>
        </div>

        <div className="sticky bottom-0 p-13" style={{ paddingBottom: keyboardOffset + 16 }}>
          <SolidButton
            size="l"
            variant="primary"
            onClick={handleOpenSaveAlert}
            isDisabled={!canSubmit || isSubmitting}
          >
            수정하기
          </SolidButton>
        </div>
      </div>
    </>
  );
};
