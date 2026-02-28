import { GroupManagementDetailPage } from '@/app-pages/group-management/ui/GroupManagementDetailPage';
import { GroupManagementMode } from '@/widgets/group-management/model/types';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    mode?: string;
  }>;
};

const isMode = (v: unknown): v is GroupManagementMode => v === 'view' || v === 'edit';

const Page = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const { mode: rawMode } = await searchParams;

  const mode: GroupManagementMode = isMode(rawMode) ? rawMode : 'view';

  return <GroupManagementDetailPage mode={mode} id={id} />;
};

export default Page;
