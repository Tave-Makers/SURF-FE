import { groupApi } from '@/features/group-management/api/groupApi';
import {
  mapContentsTypeToGroupApiType,
  mapGroupGenerationResDtoToGenerationGroups,
} from '@/features/group-management/model/mapper';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';
import { ContentsType } from '@/shared/types/contents';
import { useQuery } from '@tanstack/react-query';

export const useGroupListQuery = (type?: ContentsType) => {
  return useQuery({
    queryKey: groupQueryKeys.list(type),
    queryFn: () => {
      const apiParams = type ? { type: mapContentsTypeToGroupApiType(type) } : undefined;
      return groupApi.getGroupList(apiParams);
    },
    select: mapGroupGenerationResDtoToGenerationGroups,
  });
};
