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

/**
 *  온보딩 이벤트 이름
 */
export const ONBOARDING_EVENTS = {
  SIGNUP_PAGE_VIEW: 'signup_page_view',
  SIGNUP_INPUT: 'signup_input',
  SIGNUP_SUBMIT: 'signup_submit',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type OnBoardingEventPropsMap = {
  [ONBOARDING_EVENTS.SIGNUP_PAGE_VIEW]: { step: string };
  [ONBOARDING_EVENTS.SIGNUP_INPUT]: { field_name: string };
  [ONBOARDING_EVENTS.SIGNUP_SUBMIT]: { input_count: number };
};
