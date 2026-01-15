import { MyEditPage } from '@/app-pages/mypage/edit/ui/MyEditPage';
import { getProfile } from '@/entities/user/api/getProfile.server';
import { mapUserProfile } from '@/entities/user/model/mappers';

const Page = async () => {
  const res = await getProfile();
  const profile = mapUserProfile(res.data);

  return <MyEditPage initialProfile={profile} />;
};

export default Page;
