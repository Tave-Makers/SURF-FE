export type OnBoardingFormData = {
  name: string;
  profileImageUrl: string;
  tracks: { period: string; part: string }[];
  university: string;
  gradSchool?: string;
  email: string;
  phoneNumber: string;
};
