import { Suspense } from 'react';
import KakaoCallBackPage from '@/app-pages/login/ui/KakaoCallBackPage';

const Page = () => {
  return (
    // fallback은 추후 로딩 중 화면으로 대체
    <Suspense fallback={<div>로딩중...</div>}>
      <KakaoCallBackPage />
    </Suspense>
  );
};

export default Page;
