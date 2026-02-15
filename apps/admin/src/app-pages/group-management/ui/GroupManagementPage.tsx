'use client';

import { mockGenerationGroups } from '@/app-pages/group-management/ui/mock';
import { useGroupFilter } from '@/features/group-management/model/useGroupFilter';
import { FilterWidget } from '@/widgets/group-management/ui/FilterWidget';
import { GroupManagementAccordionList } from '@/widgets/group-management/ui/GroupManagementAccordionList';

export const GroupManagementPage = () => {
  // TODO: API 연동 후 mockData 제거
  const { filter, setFilter, filtered } = useGroupFilter(mockGenerationGroups);
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <FilterWidget filter={filter} onChange={setFilter} />
      <GroupManagementAccordionList generationGroups={filtered} onClick={() => {}} />
    </div>
  );
};
