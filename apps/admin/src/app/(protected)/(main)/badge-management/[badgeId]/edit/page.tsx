import { BadgeEditPage } from '@/app-pages/badge/BadgeEditPage';

const Page = async ({ params }: { params: Promise<{ badgeId: string }> }) => {
  const { badgeId } = await params;
  return <BadgeEditPage badgeId={Number(badgeId)} />;
};

export default Page;
