import { MemberProfilePage } from '@/app-pages/member/ui/MemberProfilePage';
import { getProfile } from '@/entities/user/api/getProfile.server';
import { mapUserProfile } from '@/entities/user/model/mappers';

interface Props {
  params: { id: string };
}

const Page = async ({ params }: Props) => {
  const memberId = Number(params.id);
  const res = await getProfile({ memberId });
  const profile = mapUserProfile(res.data);

  return <MemberProfilePage userProfile={profile} memberId={memberId} />;
};

export default Page;
