import { MyEditPage } from '@/app-pages/mypage/edit/ui/MyEditPage';
import { getMyProfile } from '@/entities/user/api/getMyProfile.server';
import { mapUserProfile } from '@/entities/user/model/mappers';

export default async function Page() {
  const res = await getMyProfile();
  const profile = mapUserProfile(res.data);

  return <MyEditPage initialProfile={profile} />;
}
