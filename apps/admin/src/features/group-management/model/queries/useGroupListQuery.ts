import { groupApi } from '@/features/group-management/api/groupApi';
import {
  mapContentsTypeToGroupApiType,
  mapGroupGenerationResDtoToGenerationGroups,
} from '@/features/group-management/model/mapper';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';
import { ContentsType } from '@/shared/types/contents';
import { useQuery } from '@tanstack/react-query';

export const useGroupListQuery = (type?: ContentsType, generation?: number) => {
  return useQuery({
    queryKey: groupQueryKeys.list({ type, generation }),
    queryFn: () => {
      const apiParams = {
        type: type ? mapContentsTypeToGroupApiType(type) : undefined,
        generation,
      };

      return groupApi.getGroupList(apiParams);
    },
    select: mapGroupGenerationResDtoToGenerationGroups,
  });
};
