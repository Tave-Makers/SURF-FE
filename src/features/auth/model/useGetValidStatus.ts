import { useQuery } from '@tanstack/react-query';
import { getValidStatus } from '../api/getValidStatus';

export const GET_VALID_STATUS_KEY = ['validStatus'];

export function useGetValidStatus() {
  return useQuery({
    queryKey: GET_VALID_STATUS_KEY,
    queryFn: getValidStatus,
    retry: false,
  });
}
