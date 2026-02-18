import { createImageUploader } from '@surf/hooks';
import { postPresignedUrl } from '../api/postPresignedUrl';

export const useImageUploader = createImageUploader({
  fetchPresignedUrls: postPresignedUrl,
  bucketUrl: process.env.NEXT_PUBLIC_S3_BUCKET_URL || '',
});
