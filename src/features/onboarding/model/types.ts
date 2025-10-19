export type OnBoardingFormData = {
  name: string;
  profileImageUrl: string;
  tracks: TrackInfo[];
  university: string;
  graduateSchool?: string;
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

export type OnBoardingRequest = {
  profileImageUrl?: string;
  name: string;
  tracks: TrackInfo[];
  university: string;
  graduateSchool?: string | null;
  email: string;
  phoneNumber: string;
};
export type TrackInfo = {
  generation: number | null;
  part: TrackPart | null;
};
export type OnBoardingResponse = {
  code: number;
  message: string;
  data: {
    memberId: number;
    profileImageUrl: string;
    name: string;
    tracks: TrackInfo[];
    university: string;
    graduateSchool?: string | null;
    email: string;
    phoneNumber: string;
  };
};
