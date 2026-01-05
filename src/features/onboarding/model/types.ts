import { TrackPart } from '@/entities/user/model/types';

export type OnBoardingFormData = {
  name: string;
  profileImage?: File;
  profileImageUrl?: string;
  tracks: TrackInfo[];
  university: string;
  graduateSchool?: string;
  email: string;
  phoneNumber: string;
};

export type OnboardingInitData = {
  nickname: string | null;
  email: string | null;
  profileImageUrl: string | null;
};

export type OnboardingState = OnboardingInitData & {
  setOnboarding: (auth: OnboardingInitData) => void;
  clearOnboarding: () => void;
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

/**
 *  온보딩 이벤트 이름
 */
export const ONBOARDING_EVENTS = {
  VIEW_SIGNUP_PAGE: 'view_signup_page',
  INPUT_SIGNUP_FIELD: 'input_signup_field',
  SUBMIT_SIGNUP_FORM: 'submit_signup_form',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type OnBoardingEventPropsMap = {
  [ONBOARDING_EVENTS.VIEW_SIGNUP_PAGE]: { step: string };
  [ONBOARDING_EVENTS.INPUT_SIGNUP_FIELD]: { field_name: string };
  [ONBOARDING_EVENTS.SUBMIT_SIGNUP_FORM]: { input_count: number };
};
