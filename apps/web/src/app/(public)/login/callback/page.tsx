import KakaoCallBackPage from '@/app-pages/login/ui/KakaoCallBackPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// suspense 임시 삭제
const Page = () => {
  return <KakaoCallBackPage />;
};

export default Page;
