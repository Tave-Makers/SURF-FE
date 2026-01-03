import { useQuery } from '@tanstack/react-query';
import { getValidStatus } from '../api/getValidStatus';

export const GET_VALID_STATUS_KEY = ['validStatus'];

export function useGetValidStatus() {
  return useQuery({
    queryKey: GET_VALID_STATUS_KEY,
    queryFn: getValidStatus,
    retry: false, // 로그인 체크 실패 시 재시도하지 않음
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지 (필요에 따라 조절)
  });
}
