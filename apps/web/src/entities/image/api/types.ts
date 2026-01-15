import { CommonResponse } from '@/shared/api/types';

export type PresignedUrlItem = {
  key: string;
  preSignedUrl: string;
  originalFileName: string;
};

export type PresignedUrlResponse = CommonResponse<PresignedUrlItem[]>;
