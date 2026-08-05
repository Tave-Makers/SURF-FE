import type { TrackPart } from '@/entities/user/model/types';
import type { CommonResponse } from '@/shared/api/types';

export type SocialProvider = 'KAKAO' | 'APPLE';

export type TrackResDTO = {
  generation: number;
  part: TrackPart | (string & {});
};

export type IntegrationTargetResDTO = {
  providers: SocialProvider[];
  email: string;
  phoneNumber: string;
  username: string;
  profileImageUrl: string | null;
  trackList: TrackResDTO[];
  selfIntroduction: string | null;
};

export type IntegrationTargetApiResponse = CommonResponse<IntegrationTargetResDTO>;

export type SocialAccountIntegrateReqDTO = {
  integrationToken: string;
};

export type SocialAccountIntegrateResDTO = {
  provider: SocialProvider;
};

export type SocialAccountIntegrateApiResponse = CommonResponse<SocialAccountIntegrateResDTO>;
