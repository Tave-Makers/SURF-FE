import { useQuery } from '@tanstack/react-query';
import { activityScoreApi } from '../../api/activityScoreApi';
import { mapActivityRecordPageDtoToHistories } from '../mapper';
import { activityScoreQueryKeys } from './queryKeys';

type UseMemberActivityRecordsQueryParams = {
  memberId: number;
  scoreType: 'REWARD' | 'PENALTY';
  pageNum: number;
  pageSize: number;
  enabled?: boolean;
};

export const useMemberActivityRecordsQuery = ({
  memberId,
  scoreType,
  pageNum,
  pageSize,
  enabled = true,
}: UseMemberActivityRecordsQueryParams) => {
  return useQuery({
    queryKey: activityScoreQueryKeys.memberActivityRecords({
      memberId,
      scoreType,
      pageNum,
      pageSize,
    }),
    queryFn: () => activityScoreApi.getMemberActivityRecords(memberId, { scoreType, pageNum, pageSize }),
    select: mapActivityRecordPageDtoToHistories,
    enabled,
    retry: false,
  });
};
