import type { SocialProvider } from '../api/types';

export type IntegrationTarget = {
  username: string;
  profileImageUrl: string | null;
  selfIntroduction: string | null;
  email: string;
  phoneNumber: string;
  providers: SocialProvider[];
  chips: string[];
};
