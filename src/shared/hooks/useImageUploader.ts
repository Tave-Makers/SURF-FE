import { UploadImage } from '@/shared/types/image';
import { postPresignedUrl } from '@/shared/api/image/postPresignedUrl';

export function useImageUploader() {
  const createFileName = (file: File) => {
    const ext = file.name.split('.').pop();
    return `${crypto.randomUUID()}.${ext}`;
  };

  const uploadImages = async (
    images: UploadImage[],
    onProgress?: (updated: UploadImage[]) => void,
  ): Promise<UploadImage[]> => {
    let updated = [...images];

    // 1. 파일명 생성
    const fileNames = images.map((img) => createFileName(img.file!));

    // 2. presigned URL 요청
    const presignedItems = await postPresignedUrl(fileNames);

    // 3. 업로드 준비 상태로 설정
    updated = updated.map((img, idx) => ({
      ...img,
      status: 'uploading',
      key: presignedItems[idx].key,
    }));
    onProgress?.(updated);

    // 4. S3 업로드
    const bucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL!;

    for (let i = 0; i < updated.length; i++) {
      const img = updated[i];
      const { preSignedUrl, key } = presignedItems[i];

      if (!img.file) continue; // 안전 처리

      try {
        await fetch(preSignedUrl, {
          method: 'PUT',
          body: img.file,
        });

        updated[i] = {
          ...img,
          status: 'uploaded',
          file: null, // 메모리 절약
          uploadedUrl: `${bucketUrl}/${key}`,
        };
      } catch {
        updated[i] = {
          ...img,
          status: 'error',
        };
      }

      onProgress?.(updated);
    }

    return updated;
  };

  return { uploadImages };
}
