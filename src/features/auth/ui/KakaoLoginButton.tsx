import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { kakaoLogin } from '../lib/kakaoLogin';

export function KakaoLoginButton() {
  return (
    <button
      className="rounded-4 flex h-[3rem] w-full cursor-pointer items-center justify-center gap-[0.5rem] bg-[#FEE500]"
      onClick={kakaoLogin}
    >
      {/* 카카오 아이콘으로 변경 필요 */}
      <SurfIcon name="ChatSolid" size="l" className="text-foreground-static-black" />
      <div className="text-foreground-static-black text-title-title2">카카오로 로그인하기</div>
    </button>
  );
}
