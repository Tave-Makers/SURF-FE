import { BadgeEditPage } from '@/app-pages/badge/BadgeEditPage';

const Page = ({ params }: { params: { badgeId: string } }) => {
  return <BadgeEditPage badgeId={Number(params.badgeId)} />;
};

export default Page;
