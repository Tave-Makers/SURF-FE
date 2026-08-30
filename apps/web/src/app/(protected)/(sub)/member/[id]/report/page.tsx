import { notFound } from 'next/navigation';
import { MemberReportPage } from '@/app-pages/member/report/ui/MemberReportPage';
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
  // 프로필과 같은 규칙: 이미 차단한 회원은 신고 화면도 열 수 없다
  if (res.data.blockedByMe) {
    notFound();
  }

  const profile = mapUserProfile(res.data);

  return (
    <MemberReportPage
      memberId={memberId}
      username={profile.username}
      university={profile.university}
      graduateSchool={profile.graduateSchool}
    />
  );
};

export default Page;
