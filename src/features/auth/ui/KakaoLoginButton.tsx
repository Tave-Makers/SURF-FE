import { kakaoLogin } from '../lib/kakaoLogin';
import Kakao from '../../../../public/images/kakao.svg';
export function KakaoLoginButton() {
  return (
    <button
      className="rounded-4 flex h-[3rem] w-full cursor-pointer items-center justify-center gap-[0.5rem] bg-[#FEE500]"
      onClick={kakaoLogin}
    >
      <Kakao />
      <div className="text-foreground-static-black text-title-title2">카카오로 로그인하기</div>
    </button>
  );
}
