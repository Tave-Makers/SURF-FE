import Apple from '../../../../public/images/apple.svg';
import { appleLogin } from '../lib/appleLogin';

export const AppleLoginButton = () => {
  return (
    <button
      type="button"
      className="rounded-4 flex h-[3rem] w-full cursor-pointer items-center justify-center gap-[0.5rem] bg-[#FFFFFF]"
      onClick={appleLogin}
    >
      <Apple className="text-foreground-static-black h-[1.375rem] w-[1.125rem]" />
      <div className="text-foreground-static-black text-title-title2">애플로 로그인하기</div>
    </button>
  );
};
