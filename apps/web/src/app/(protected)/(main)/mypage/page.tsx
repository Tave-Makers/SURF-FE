import { getMyProfile } from '@/entities/user/api/getMyProfile.server';
import { mapUserProfile } from '@/entities/user/model/mappers';
import { MyPage } from '@/app-pages/mypage/ui/MyPage';

export default async function MyPagePage() {
  const res = await getMyProfile();
  const profile = mapUserProfile(res.data);

  return <MyPage userProfile={profile} />;
}
