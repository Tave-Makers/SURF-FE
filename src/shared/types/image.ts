export type ImageData = {
  id: string;
  file: File;
  preview: string; // 로컬 File 객체를 임시로 볼 수 있게 해주는 URL 문자열
};
