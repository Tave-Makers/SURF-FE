import { createFileUploader } from '@surf/hooks';
import { postPresignedUrl } from '@/entities/image/api/postPresignedUrl';

export const useFileUploader = createFileUploader({
  fetchPresignedUrls: postPresignedUrl,
  bucketUrl: process.env.NEXT_PUBLIC_S3_BUCKET_URL || '',
});
