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
  /** 파일 확장자 유지한 랜덤 파일명 생성 */
  const createFileName = (file: File) => {
    const ext = file.name.split('.').pop();
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
    let updated = [...images];

    // 1) S3에 저장될 파일명 생성
    const fileNames = images.map((img) => createFileName(img.file!));

    // 2) presigned URL 요청
    const presignedItems = await postPresignedUrl(fileNames);

    // 3) 업로드 시작 상태로 업데이트
    updated = updated.map((img, idx) => ({
      ...img,
      status: 'uploading',
      key: presignedItems[idx].key,
    }));
    onProgress?.(updated);

    const bucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL!;

    // 4) presigned URL로 PUT 업로드
    for (let i = 0; i < updated.length; i++) {
      const img = updated[i];
      const { preSignedUrl, key } = presignedItems[i];

      if (!img.file) continue;

      try {
        await fetch(preSignedUrl, { method: 'PUT', body: img.file });

        updated[i] = {
          ...img,
          status: 'uploaded',
          file: null, // 메모리 해제
          uploadedUrl: `${bucketUrl}/${key}`,
        };
      } catch {
        updated[i] = { ...img, status: 'error' };
      }

      onProgress?.(updated);
    }

    return updated;
  };

  return { uploadImages };
}
