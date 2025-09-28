import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { kakaoLogin } from '../lib/kakaoLogin';

export function KakaoLoginButton() {
  return (
    <button
      className="flex h-[3rem] w-full cursor-pointer items-center justify-center gap-[0.5rem] rounded-[0.5rem] bg-[#FEE500]"
      onClick={kakaoLogin}
    >
      {/* 카카오 아이콘으로 변경 필요 */}
      <SurfIcon name="ChatSolid" size="l" color="text-logo-normal" />
      <div className="text-logo-normal text-body-16-600--1">카카오로 로그인하기</div>
    </button>
  );
}
