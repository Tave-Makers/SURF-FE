import { groupApi } from '@/features/group-management/api/groupApi';
import {
  mapContentsTypeToGroupApiType,
  mapGroupGenerationResDtoToGenerationGroups,
} from '@/features/group-management/model/mapper';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';
import { ContentsType } from '@/shared/types/contents';
import { useQuery } from '@tanstack/react-query';

export type GroupListParams = {
  generation?: number;
  type?: ContentsType;
};

export const useGroupListQuery = (params?: GroupListParams) => {
  return useQuery({
    queryKey: groupQueryKeys.list(params),
    queryFn: ({ queryKey }) => {
      const [, , uiParams] = queryKey;
      const apiParams =
        uiParams?.type != null ? { type: mapContentsTypeToGroupApiType(uiParams.type) } : undefined;
      return groupApi.getGroupList(apiParams);
    },
    select: mapGroupGenerationResDtoToGenerationGroups,
  });
};
