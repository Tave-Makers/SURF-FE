import { BadgeAssignPage } from '@/app-pages/badge/BadgeAssignPage';

const Page = ({ params }: { params: { badgeId: string } }) => {
  return <BadgeAssignPage badgeId={Number(params.badgeId)} />;
};

export default Page;
