import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { safeUUID } from '@surf/utils';
import { Banner, BannerFormData } from '@/entities/banner/model/types';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';

export const useBannerEdit = (bannerId: string, initialData: Banner) => {
  const router = useRouter();
  const { uploadImages } = useImageUploader();
  const { open: openAlert, close: closeAlert } = useAlertStore();
  const { show: showToast } = useToastStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initial, setInitial] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerFormData>({
    imageUrl: '',
    name: '',
    linkUrl: '',
    isActive: true,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    if (!initialData || initial) return;

    setInitial(initialData);
    setForm({
      imageUrl: initialData.imageUrl,
      name: initialData.name,
      linkUrl: initialData.linkUrl,
      isActive: initialData.isActive,
    });
  }, [bannerId, initialData, initial]);

  // 변경 감지 및 유효성 검사
  const isChanged = useMemo(() => {
    if (!initial) return false;
    return (
      initial.isActive !== form.isActive ||
      initial.name !== form.name ||
      initial.linkUrl !== form.linkUrl ||
      bannerFile !== null
    );
  }, [initial, form, bannerFile]);

  const canSubmit = useMemo(() => {
    const isTextValid = form.name.trim().length > 0 && form.linkUrl.trim().length > 0;
    // 기존 이미지 존재 or 새로 선택한 파일 존재
    const hasImage = form.imageUrl.trim().length > 0 || bannerFile !== null;
    return !!(initial && isTextValid && hasImage && isChanged);
  }, [initial, form, bannerFile, isChanged]);

  const handleSubmit = useCallback(async () => {
    if (!initial || isSubmitting) return;
    setIsSubmitting(true);
    try {
      let finalUrl = form.imageUrl;
      if (bannerFile) {
        const [result] = await uploadImages([
          { id: safeUUID(), file: bannerFile, preview: '', status: 'pending' },
        ]);
        if (result.status !== 'uploaded' || !result.uploadedUrl) throw new Error();
        finalUrl = result.uploadedUrl;
      }
      const payload = {
        name: form.name,
        linkUrl: form.linkUrl,
        imageUrl: finalUrl,
        status: form.isActive,
      };

      console.log('배너 수정 API 호출:', payload);
      // TODO: await updateBanner(payload);
      router.replace(PAGE_ROUTES.BANNER.LIST);
    } catch {
      showToast('배너 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [initial, isSubmitting, form, bannerFile, uploadImages, router, showToast]);

  const handleOpenSaveAlert = () => {
    openAlert({
      state: 'default',
      title: '수정하시겠습니까?',
      infoText: '수정하기 버튼을 누를 시, 수정된 내용이 SURF의 홈 화면에 반영됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
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
      title: '삭제하시겠습니까?',
      infoText:
        '삭제하기 버튼을 누를 시, 배너 리스트에서 해당 배너 데이터가 영구적으로 삭제됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제하기',
          onClick: () => {
            closeAlert();
            // TODO: onDelete 로직 실행
          },
        },
      ],
    });
  };

  return {
    state: { form, isSubmitting, canSubmit, isLoading: !initial },
    actions: { setForm, setBannerFile, handleSubmit, handleOpenSaveAlert, handleOpenDeleteAlert },
  };
};
