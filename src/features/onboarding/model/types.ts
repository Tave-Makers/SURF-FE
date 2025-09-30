export type OnBoardingFormData = {
  name: string;
  profileImageUrl: string;
  tracks: { generation: number | null; part: TrackPart | null }[];
  university: string;
  gradSchool?: string;
  email: string;
  phoneNumber: string;
};

export type TrackPart =
  | 'BACKEND'
  | 'WEB_FRONTEND'
  | 'APP_FRONTEND'
  | 'DESIGN'
  | 'DATA_ANALYSIS'
  | 'DEEP_LEARNING';
