export type YearMonth = `${number}-${number}`;

export type CareerBase = {
  companyName: string;
  position: string;
  startDate: YearMonth;
  endDate?: YearMonth | null;
  isWorking?: boolean;
};

export type CareerDTO = CareerBase & { careerId: number };
export type CareerCreateDTO = CareerBase;
export type CareerUpdateDTO = Partial<CareerBase> & { careerId: number };

export type UserLevel = 'superManager' | 'executiveManager' | 'manager' | 'member';

export type UserProfile = {
  name: string;
  phoneNumber: string;
  email: string;
  university: string | null;
  graduateSchool: string | null;
  level: UserLevel;
  activityScore: number;
  isActive: boolean;
  chips: string[];
  careers: CareerDTO[];
};

export type UpdateProfileRequestDTO = {
  phoneNumber?: string;
  phoneNumberPublic?: boolean;
  email?: string;
  careersToCreate?: CareerCreateDTO[];
  careersToUpdate?: CareerUpdateDTO[];
  careerIdsToDelete?: number[];
};
