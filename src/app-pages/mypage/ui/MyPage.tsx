import { UserLevel } from '@/features/profile/model/userLevel';
import { MyPageActions } from '@/widgets/mypage-actions/ui/MyPageActions';
import { ProfileTabs } from '@/widgets/profile-tabs/ui/ProfileTabs';
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';

type MyPageProps = {
  name: string;
  level: UserLevel;
  chips: string[];
  isActiveMember: boolean;
};

export function MyPage({ name, level, chips, isActiveMember }: MyPageProps) {
  return (
    <div className="flex flex-col">
      <ProfileHeader name={name} level={level} chips={chips} />
      <MyPageActions isActiveMember={isActiveMember} />
      <ProfileTabs />
    </div>
  );
}
