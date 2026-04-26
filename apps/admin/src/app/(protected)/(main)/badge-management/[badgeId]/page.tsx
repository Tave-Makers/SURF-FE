import { BadgeDetailPage } from '@/app-pages/badge/BadgeDetailPage';

const Page = ({ params }: { params: { badgeId: string } }) => {
  return <BadgeDetailPage badgeId={Number(params.badgeId)} />;
};

export default Page;
