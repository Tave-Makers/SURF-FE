import { useQuery } from '@tanstack/react-query';
import { activityScoreApi } from '../../api/activityScoreApi';
import { mapActivityTypeGroupsDtoToCategories } from '../mapper';
import { activityScoreQueryKeys } from './queryKeys';

export const useActivityTypesQuery = () => {
  return useQuery({
    queryKey: activityScoreQueryKeys.activityTypes(),
    queryFn: activityScoreApi.getActivityTypes,
    select: mapActivityTypeGroupsDtoToCategories,
    retry: false,
  });
};
