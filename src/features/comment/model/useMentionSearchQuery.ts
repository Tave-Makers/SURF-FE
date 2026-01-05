import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchMentionableMembers } from '../api/searchMentionableMembers';

export function useMentionSearchQuery(keyword: string, enabled: boolean) {
  return useQuery({
    queryKey: ['member-mention', keyword],
    queryFn: () => searchMentionableMembers(keyword),
    enabled: enabled && keyword.trim().length >= 2,
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
}
