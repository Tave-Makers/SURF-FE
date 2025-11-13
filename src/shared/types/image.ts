export type ImageData = {
  id: string;
  file: File;
  preview: string; // 로컬 File 객체를 임시로 볼 수 있게 해주는 URL 문자열
};

export type UploadImage = {
  id: string;
  file: File | null; // 업로드 후엔 null 처리 가능
  preview: string; // UI용 preview URL
  status: 'pending' | 'uploading' | 'uploaded' | 'error'; // 업로드 상태
  uploadedUrl?: string; // S3 최종 URL
  key?: string; // presigned response의 S3 object key
};
