import { safeUUID, UploadFile } from '@surf/utils';

/**
 * presigned URL을 받아 S3에 파일을 업로드하는 훅.
 * - 원본 파일명 보존 (originalFileName)
 * - 대용량 파일 대응을 위해 타임아웃 120초
 */

interface CreateFileUploaderProps {
  fetchPresignedUrls: (fileNames: string[]) => Promise<{ preSignedUrl: string; key: string }[]>;
  bucketUrl: string;
}

export function createFileUploader({ fetchPresignedUrls, bucketUrl }: CreateFileUploaderProps) {
  return function useFileUploader() {
    const createStorageFileName = (file: File) => {
      const lastDot = file.name.lastIndexOf('.');
      const ext = lastDot > 0 ? file.name.slice(lastDot + 1).toLowerCase() : '';
      return ext ? `${safeUUID()}.${ext}` : safeUUID();
    };

    const uploadToS3 = async (file: File, preSignedUrl: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120_000);

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

    const uploadFiles = async (
      files: UploadFile[],
      onProgress?: (updated: UploadFile[]) => void,
    ): Promise<UploadFile[]> => {
      if (!bucketUrl) {
        throw new Error('NEXT_PUBLIC_S3_BUCKET_URL 환경 변수가 설정되지 않았습니다.');
      }

      let updated = [...files];

      const storageFileNames = files.map((f) => createStorageFileName(f.file!));
      const presignedItems = await fetchPresignedUrls(storageFileNames);

      if (presignedItems.length !== files.length) {
        throw new Error('presigned URL 응답 개수가 일치하지 않습니다.');
      }

      updated = updated.map((f, idx) => ({
        ...f,
        status: 'uploading' as const,
        key: presignedItems[idx].key,
      }));
      onProgress?.(updated);

      const uploadPromises = updated.map(async (uploadFile, idx) => {
        const file = uploadFile.file!;
        const { preSignedUrl, key } = presignedItems[idx];

        try {
          await uploadToS3(file, preSignedUrl);

          return {
            ...uploadFile,
            status: 'uploaded' as const,
            file: null,
            uploadedUrl: `${bucketUrl}/${key}`,
          };
        } catch (err) {
          console.error(`S3 파일 업로드 실패 (${uploadFile.id})`, err);

          return {
            ...uploadFile,
            status: 'error' as const,
          };
        }
      });

      updated = await Promise.all(uploadPromises);
      onProgress?.(updated);

      return updated;
    };

    return { uploadFiles };
  };
}
