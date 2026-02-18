'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { safeUUID, UploadImage } from '@surf/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { BannerFormData } from '@/entities/banner/model/types';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BannerFormWidget } from '@/widgets/banner/ui/BannerFormWidget';

const INITIAL_FORM: BannerFormData = {
  imageUrl: '',
  name: '',
  linkUrl: '',
  isActive: true,
};

export const BannerCreatePage = () => {
  const router = useRouter();

  const [form, setForm] = useState<BannerFormData>(INITIAL_FORM);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { uploadImages } = useImageUploader();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);

  const canSubmit = useMemo(() => {
    return form.name.trim().length > 0 && form.linkUrl.trim().length > 0 && bannerFile != null;
  }, [form.name, form.linkUrl, bannerFile]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const uploadItem: UploadImage = {
        id: safeUUID(),
        file: bannerFile,
        preview: '',
        status: 'pending',
      };

      // 이미지 업로드
      const [result] = await uploadImages([uploadItem]);

      if (result.status !== 'uploaded' || !result.uploadedUrl) {
        showToast('이미지 업로드에 실패했습니다.');
        return;
      }

      // const imageUrl = result.uploadedUrl;
      // 최종 API 호출 시 imageUrl 넣기
      // await createBanner({ ...form, imageUrl });
      showToast('배너가 생성되었습니다.');
      // console.log({ ...form, imageUrl: result.uploadedUrl });
      router.replace(PAGE_ROUTES.BANNER.LIST);
    } catch {
      showToast('배너 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [bannerFile, form, uploadImages, showToast, router, isSubmitting]);

  const handleOpenSaveAlert = () => {
    openAlert({
      state: 'default',
      title: '저장하시겠습니까?',
      infoText: '저장하기 버튼을 누를 시, 해당 배너가 새롭게 SURF의 홈 화면에 추가됩니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'primary',
          label: '저장하기',
          onClick: () => {
            closeAlert();
            void handleSubmit();
          },
        },
      ],
    });
  };

  return (
    <BannerFormWidget
      mode="create"
      data={form}
      onChange={setForm}
      onSelectFile={setBannerFile}
      onSubmit={handleOpenSaveAlert}
      isSubmitting={isSubmitting}
      canSubmit={canSubmit}
      submitLabel="저장하기"
    />
  );
};
