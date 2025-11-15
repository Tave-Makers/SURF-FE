import { UploadImage } from '@/shared/types/image';
import { postPresignedUrl } from '@/shared/api/image/postPresignedUrl';

/**
 * presigned URL을 받아 S3에 업로드하는 훅.
 * - 파일명 생성
 * - presigned URL 요청
 * - 실제 S3 PUT 업로드
 *
 * 업로드 진행 상태를 반영해야 할 경우 onProgress 콜백으로 상위에서 UI 업데이트 가능.
 */
export function useImageUploader() {
  /** 안전한 확장자 기반 파일명 생성 */
  const createFileName = (file: File) => {
    let ext = '';
    const lastDot = file.name.lastIndexOf('.');

    if (lastDot > 0) {
      ext = file.name.slice(lastDot + 1).toLowerCase();
    }

    // 확장자가 없거나 이상한 경우 → MIME 타입 기반
    if (!ext) {
      const mimeExt = file.type.split('/')[1];
      ext = mimeExt || 'jpg';
    }

    return `${crypto.randomUUID()}.${ext}`;
  };

  /**
   * 이미지 배열을 순차적으로 업로드하고
   * 상태(uploading / uploaded / error)를 업데이트한다.
   */
  const uploadImages = async (
    images: UploadImage[],
    onProgress?: (updated: UploadImage[]) => void,
  ): Promise<UploadImage[]> => {
    // Deep copy
    let updated = [...images];

    // 1) S3에 저장될 파일명 생성
    const fileNames = images.map((img) => createFileName(img.file!));

    // 2) presigned URL 요청
    const presignedItems = await postPresignedUrl(fileNames);

    // 3) 업로드 시작 상태로 업데이트
    updated = updated.map((img, idx) => ({
      ...img,
      status: 'uploading' as const,
      key: presignedItems[idx].key,
    }));
    onProgress?.(updated);

    const bucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL!;
    if (!bucketUrl) {
      throw new Error('NEXT_PUBLIC_S3_BUCKET_URL 환경 변수가 설정되지 않았습니다.');
    }

    // 4) presigned URL로 PUT 업로드
    const uploadPromises = updated.map(async (img, idx) => {
      const { preSignedUrl, key } = presignedItems[idx];

      if (!img.file) return img;

      try {
        // 타임아웃 + abort 제어
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초

        await fetch(preSignedUrl, {
          method: 'PUT',
          body: img.file,
          headers: {
            'Content-Type': img.file.type || 'application/octet-stream',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return {
          ...img,
          status: 'uploaded' as const,
          file: null,
          uploadedUrl: `${bucketUrl}/${key}`,
        };
      } catch (err) {
        console.error(`S3 업로드 실패 (${img.id})`, err);
        return {
          ...img,
          status: 'error' as const,
        };
      }
    });

    updated = await Promise.all(uploadPromises);
    onProgress?.(updated);

    return updated;
  };

  return { uploadImages };
}
