import { useQuery } from '@tanstack/react-query';
import { homeQueryKeys } from '../api/queryKeys';
import { mapHomeDataToHomeUI } from '../model/mappers';
import { getHome } from './getHome';
import { HomeApiResponseData } from './types';

export const useGetHome = () => {
  return useQuery({
    queryKey: homeQueryKeys.all,
    queryFn: getHome,
    select: (data: HomeApiResponseData) => {
      return mapHomeDataToHomeUI(data);
    },
  });
};
