export interface CareerForm {
  careerId: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isWorking: boolean;
}

export interface FormValues {
  profileImage?: File;
  profileImageUrl?: string;
  selfIntroduction: string;
  link: string;
  email: string;
  phoneNumber: string;
  phoneNumberPublic: boolean;
  university: string;
  hasGraduateSchool: boolean;
  graduateSchool: string;
  careers: CareerForm[];
}
