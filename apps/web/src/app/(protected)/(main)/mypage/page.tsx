import { MyPage } from '@/app-pages/mypage/ui/MyPage';
import { getMyProfile } from '@/entities/user/api/getMyProfile.server';
import { mapUserProfile } from '@/entities/user/model/mappers';

const MyPagePage = async () => {
  const res = await getMyProfile();
  const profile = mapUserProfile(res.data);

  return <MyPage userProfile={profile} />;
};

export default MyPagePage;
