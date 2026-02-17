import { useCallback, useState } from 'react';
import { safeUUID, UploadImage } from '@surf/utils';
import { useImageUploader } from '@/entities/image/model/useImageUploader';

type SingleImageState = UploadImage;

export function useSingleImageUpload() {
  const { uploadImages } = useImageUploader();

  const [image, setImage] = useState<SingleImageState | null>(null);

  const selectAndUpload = useCallback(
    async (file: File) => {
      const id = safeUUID();
      const preview = URL.createObjectURL(file);

      // 기존 preview 정리
      setImage((prev) => {
        if (prev?.preview) URL.revokeObjectURL(prev.preview);
        return null;
      });

      // 선택 즉시 UI 반영
      const uploadItem: UploadImage = {
        id,
        file,
        preview,
        status: 'pending',
      };
      setImage(uploadItem);

      try {
        const [result] = await uploadImages([uploadItem], (progress) => {
          const p = progress[0];
          setImage((prev) => (prev ? { ...prev, ...p, preview: prev.preview } : p));
        });

        setImage((prev) => (prev ? { ...prev, ...result, preview: prev.preview } : result));

        return result.uploadedUrl ?? '';
      } catch {
        setImage((prev) => (prev ? { ...prev, status: 'error' } : null));
        return '';
      }
    },
    [uploadImages],
  );

  const clear = useCallback(() => {
    setImage((prev) => {
      if (prev?.preview) URL.revokeObjectURL(prev.preview);
      return null;
    });
  }, []);

  return { image, setImage, selectAndUpload, clear };
}
