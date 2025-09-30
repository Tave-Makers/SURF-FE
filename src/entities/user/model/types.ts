export type CareerDTO = {
  careerId?: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null | undefined;
  isWorking?: boolean;
};

export type CareerUpdateDTO = {
  careerId?: number;
  companyName?: string;
  position?: string;
  startDate?: string;
  endDate?: string | null;
  isWorking?: boolean;
};

export type UpdateProfileRequestDTO = {
  phoneNumber?: string;
  phoneNumberPublic?: boolean;
  email?: string;
  careersToCreate?: CareerDTO[];
  careersToUpdate?: CareerUpdateDTO[];
  careerIdsToDelete?: number[];
};
