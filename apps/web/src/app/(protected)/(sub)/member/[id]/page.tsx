import { notFound } from 'next/navigation';
import { MemberProfilePage } from '@/app-pages/member/ui/MemberProfilePage';
import { getProfile } from '@/entities/user/api/getProfile.server';
import { mapUserProfile } from '@/entities/user/model/mappers';

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const memberId = Number(id);
  if (Number.isNaN(memberId) || memberId <= 0) {
    notFound();
  }
  const res = await getProfile({ memberId });
  const profile = mapUserProfile(res.data);

  return <MemberProfilePage userProfile={profile} memberId={memberId} />;
};

export default Page;
