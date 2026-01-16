import { MyPage } from '@/app-pages/mypage/ui/MyPage';
import { getProfile } from '@/entities/user/api/getProfile.server';
import { mapUserProfile } from '@/entities/user/model/mappers';

const Page = async () => {
  const res = await getProfile();
  const profile = mapUserProfile(res.data);

  return <MyPage userProfile={profile} />;
};

export default Page;
