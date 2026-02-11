import { Filter } from '@/entities/group-management/model/types';
import { GenerationGroup } from '@/entities/group-management/model/types';
import { useMemo, useState } from 'react';

export function useGroupFilter(generationGroups: GenerationGroup[]) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return generationGroups;

    return generationGroups.map((g) => ({
      ...g,
      groupList: g.groupList.filter((item) => item.type === filter),
    }));
  }, [filter, generationGroups]);

  return {
    filter,
    setFilter,
    filtered,
  };
}
