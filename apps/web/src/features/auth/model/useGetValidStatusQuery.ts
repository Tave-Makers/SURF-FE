import { useQuery } from '@tanstack/react-query';
import { getValidStatus } from '@/features/auth/api/getValidStatus';
import { ValidStatusResponse } from '@/features/auth/api/types';

export const useGetValidStatusQuery = () => {
  return useQuery<ValidStatusResponse['data']>({
    queryKey: ['validStatus'],
    queryFn: getValidStatus,
  });
};
