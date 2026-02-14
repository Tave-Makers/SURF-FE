import { GroupManagementDetailPage } from '@/app-pages/group-management/ui/GroupManagementDetailPage';
import type { GroupManagementMode } from '@/widgets/group-management/ui/GroupMemberSection';

interface PageProps {
  searchParams: {
    mode?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  const rawMode = searchParams.mode;

  const mode: GroupManagementMode =
    rawMode === 'create' || rawMode === 'edit' || rawMode === 'view' ? rawMode : 'view'; // 기본값: 'view'

  return <GroupManagementDetailPage mode={mode} />;
};

export default Page;
