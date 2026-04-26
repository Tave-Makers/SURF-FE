import { BadgeAssignPage } from '@/app-pages/badge/BadgeAssignPage';

const Page = async ({ params }: { params: Promise<{ badgeId: string }> }) => {
  const { badgeId } = await params;
  return <BadgeAssignPage badgeId={Number(badgeId)} />;
};

export default Page;
