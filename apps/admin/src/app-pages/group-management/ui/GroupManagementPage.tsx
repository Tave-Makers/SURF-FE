'use client';

import { useGroupListQuery } from '@/features/group-management/model/queries/useGroupListQuery';
import { useGroupFilter } from '@/features/group-management/model/useGroupFilter';
import { FilterWidget } from '@/widgets/group-management/ui/FilterWidget';
import { GroupManagementAccordionList } from '@/widgets/group-management/ui/GroupManagementAccordionList';

export const GroupManagementPage = () => {
  const { data, isLoading, isError } = useGroupListQuery();
  const generationGroups = data ?? [];

  const { filter, setFilter, filtered } = useGroupFilter(generationGroups);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }
  if (isError) {
    return <div className="flex h-full items-center justify-center">Failed to load</div>;
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <FilterWidget filter={filter} onChange={setFilter} />
      <GroupManagementAccordionList generationGroups={filtered} onClick={() => {}} />
    </div>
  );
};
