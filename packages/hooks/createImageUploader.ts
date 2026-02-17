import { safeUUID, UploadImage } from '@surf/utils';

/**
 * presigned URL을 받아 S3에 업로드하는 훅.
 * - 파일명 생성
 * - presigned URL 요청
 * - 실제 S3 PUT 업로드
 *
 * 업로드 진행 상태를 반영해야 할 경우 onProgress 콜백으로 상위에서 UI 업데이트 가능.
 */

interface createImageUploaderProps {
  fetchPresignedUrls: (fileNames: string[]) => Promise<{ preSignedUrl: string; key: string }[]>;
  bucketUrl: string;
}
export function createImageUploader({ fetchPresignedUrls, bucketUrl }: createImageUploaderProps) {
  return function useImageUploader() {
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
        ext = mimeExt?.split('+')[0] || 'jpg';
      }

      return `${safeUUID()}.${ext}`;
    };

    /** presigned URL로 S3 PUT 업로드 (timeout 포함) */
    const uploadToS3 = async (file: File, preSignedUrl: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const res = await fetch(preSignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`S3 업로드 실패: ${res.status}`);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    /** 이미지 업로드 메인 함수 */
    const uploadImages = async (
      images: UploadImage[],
      onProgress?: (updated: UploadImage[]) => void,
    ): Promise<UploadImage[]> => {
      if (!bucketUrl) {
        throw new Error('NEXT_PUBLIC_S3_BUCKET_URL 환경 변수가 설정되지 않았습니다.');
      }

      let updated = [...images];

      // 1) S3에 저장될 파일명 생성
      const fileNames = images.map((img) => createFileName(img.file!));

      // 2) presigned URL 요청
      const presignedItems = await fetchPresignedUrls(fileNames);

      if (presignedItems.length !== images.length) {
        throw new Error('presigned URL 응답 개수가 일치하지 않습니다.');
      }

      // 3) 업로드 시작 상태로 업데이트
      updated = updated.map((img, idx) => ({
        ...img,
        status: 'uploading' as const,
        key: presignedItems[idx].key,
      }));
      onProgress?.(updated);

      // 4) presigned URL로 병렬 업로드
      const uploadPromises = updated.map(async (img, idx) => {
        const file = img.file!;
        const { preSignedUrl, key } = presignedItems[idx];

        try {
          await uploadToS3(file, preSignedUrl);

          return {
            ...img,
            status: 'uploaded' as const,
            file: null, // 메모리 최적화
            uploadedUrl: `${bucketUrl}/${key}`,
          };
        } catch (err) {
          console.error(`S3 업로드 실패 (${img.id})`, err);

          return {
            ...img,
            status: 'error' as const,
            // file은 그대로 둬야 재시도 가능
          };
        }
      });

      updated = await Promise.all(uploadPromises);
      onProgress?.(updated);

      return updated;
    };

    return { uploadImages };
  };
}
