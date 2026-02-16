export interface Banner {
  id: number;
  name: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  displayOrder: number;
}

// 폼 입력 데이터 타입
export interface BannerFormData {
  name: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}
