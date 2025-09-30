import { MyPage } from '@/app-pages/mypage/ui/MyPage';
export default function Page() {
  return (
    <MyPage
      name="김테이비"
      level="manager"
      chips={['13기 백엔드', '13기 프론트엔드']}
      isActiveMember={true}
    />
  );
}
