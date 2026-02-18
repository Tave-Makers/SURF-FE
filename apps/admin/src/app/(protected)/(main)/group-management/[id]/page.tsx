import { GroupManagementDetailPage } from '@/app-pages/group-management/ui/GroupManagementDetailPage';
import type { GroupManagementMode } from '@/widgets/group-management/ui/GroupMemberSection';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    mode?: string;
  }>;
};

const isMode = (v: unknown): v is GroupManagementMode =>
  v === 'view' || v === 'edit' || v === 'create';

const Page = async ({ searchParams }: PageProps) => {
  const { mode: rawMode } = await searchParams;

  const mode: GroupManagementMode = isMode(rawMode) ? rawMode : 'view';

  return <GroupManagementDetailPage mode={mode} />;
};

export default Page;
