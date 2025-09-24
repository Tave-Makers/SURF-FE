export interface UserOnboardingData {
  name?: string;
  profileImage?: File | null; // 업로드할 이미지 파일
  // TODO: 아마 onbarding 뒷 단계에서도 필요한 데이터 추가
}
