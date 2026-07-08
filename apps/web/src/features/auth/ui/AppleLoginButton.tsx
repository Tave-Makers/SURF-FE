import Apple from '../../../../public/images/apple.svg';
import { appleLogin } from '../lib/appleLogin';

export const AppleLoginButton = () => {
  return (
    <button
      type="button"
      className="rounded-4 bg-background-normal-inverse flex h-[3rem] w-full cursor-pointer items-center justify-center gap-[0.5rem]"
      onClick={appleLogin}
    >
      <Apple width={24} height={24} className="text-foreground-normal-reverse shrink-0" />
      <div className="text-foreground-normal-reverse text-title-title2">애플로 로그인하기</div>
    </button>
  );
};
