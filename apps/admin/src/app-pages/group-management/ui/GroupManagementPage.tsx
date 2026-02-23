'use client';

import { Fab } from '@surf/ui/fab';
import { useRouter } from 'next/navigation';
import { useGroupListQuery } from '@/features/group-management/model/queries/useGroupListQuery';
import { useGroupFilter } from '@/features/group-management/model/useGroupFilter';
import { PAGE_ROUTES } from '@/shared/config/path';
import { FilterWidget } from '@/widgets/group-management/ui/FilterWidget';
import { GroupManagementAccordionList } from '@/widgets/group-management/ui/GroupManagementAccordionList';

export const GroupManagementPage = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGroupListQuery();
  const generationGroups = data ?? [];

  const { filter, setFilter, filtered } = useGroupFilter(generationGroups);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }
  if (isError) {
    return <div className="flex h-full items-center justify-center">Failed to load</div>;
  }

  const handleNavigate = (groupId: number) => {
    router.push(PAGE_ROUTES.GROUP_MNG.VIEW(groupId));
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <FilterWidget filter={filter} onChange={setFilter} />
      <GroupManagementAccordionList generationGroups={filtered} onClick={handleNavigate} />
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="relative mx-auto h-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
          <div className="pointer-events-auto absolute right-15 bottom-15">
            <Fab
              ariaLabel="그룹 생성 버튼"
              onClick={() => router.push(PAGE_ROUTES.GROUP_MNG.CREATE)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
