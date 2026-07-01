'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import { safeUUID, UploadImage } from '@surf/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { useCreateBadgeMutation } from '@/features/badge/model/queries/useCreateBadgeMutation';
import { PAGE_ROUTES } from '@/shared/config/path';

export const useBadgeCreateForm = () => {
  const router = useRouter();

  const [badgeName, setBadgeName] = useState('');
  const [badgeFile, setBadgeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { uploadImages } = useImageUploader();
  const { mutateAsync: createBadge } = useCreateBadgeMutation();
  const showToast = useToastStore((s) => s.show);

  const canSubmit = useMemo(() => {
    return badgeName.trim().length > 0 && badgeFile != null;
  }, [badgeName, badgeFile]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !badgeFile || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const uploadItem: UploadImage = {
        id: safeUUID(),
        file: badgeFile,
        preview: '',
        status: 'pending',
      };

      const [result] = await uploadImages([uploadItem]);

      if (result.status !== 'uploaded' || !result.uploadedUrl) {
        showToast('이미지 업로드에 실패했습니다.');
        return;
      }

      const { badgeId } = await createBadge({
        name: badgeName.trim(),
        imageUrl: result.uploadedUrl,
      });

      showToast('배지가 생성되었습니다.');
      router.replace(PAGE_ROUTES.BADGE_MNG.DETAIL(badgeId));
    } catch {
      showToast('배지 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [badgeFile, badgeName, canSubmit, createBadge, isSubmitting, router, showToast, uploadImages]);

  return {
    state: {
      badgeName,
      canSubmit,
      isSubmitting,
    },
    actions: {
      setBadgeName,
      setBadgeFile,
      handleSubmit,
    },
  };
};
