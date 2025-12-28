import { useQuery } from '@tanstack/react-query';
import { homeQueryKeys } from '../api/queryKeys';
import { getHome } from './getHome';
import { HomeApiResponseData } from './types';
import { mapHomeDataToHomeUI } from '../model/mappers';

export const useGetHome = () => {
  return useQuery({
    queryKey: homeQueryKeys.home(),
    queryFn: getHome,
    select: (data: HomeApiResponseData) => {
      return mapHomeDataToHomeUI(data);
    },
  });
};
