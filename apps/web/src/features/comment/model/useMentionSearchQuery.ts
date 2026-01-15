import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchMentionableMembers } from '../api/searchMentionableMembers.client';

export function useMentionSearchQuery(keyword: string, enabled: boolean) {
  const trimmedKeyword = keyword.trim();

  return useQuery({
    queryKey: ['member-mention', trimmedKeyword],
    queryFn: () => searchMentionableMembers(trimmedKeyword),
    enabled: enabled && trimmedKeyword.length >= 2,
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
}
