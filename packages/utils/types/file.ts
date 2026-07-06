export type UploadFile = {
  id: string;
  file: File | null;
  originalFileName: string;
  fileSize: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  uploadedUrl?: string;
  key?: string;
};
