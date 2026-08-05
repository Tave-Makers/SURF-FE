'use client';

import { useMemo, useState } from 'react';
import { Filter } from '@/entities/group-management/model/types';
import { GenerationGroup } from '@/entities/group-management/model/types';

export function useGroupFilter(generationGroups: GenerationGroup[] = []) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return generationGroups;

    return generationGroups
      .map((g) => ({
        ...g,
        groupList: g.groupList.filter((item) => item.type === filter),
      }))
      .filter((g) => g.groupList.length > 0);
  }, [filter, generationGroups]);

  return {
    filter,
    setFilter,
    filtered,
  };
}
