import { BadgeDetailPage } from '@/app-pages/badge/BadgeDetailPage';

const Page = async ({ params }: { params: Promise<{ badgeId: string }> }) => {
  const { badgeId } = await params;
  return <BadgeDetailPage badgeId={Number(badgeId)} />;
};

export default Page;
