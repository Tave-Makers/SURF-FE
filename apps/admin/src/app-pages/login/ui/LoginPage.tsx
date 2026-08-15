import Logo from '../../../../public/admin-logo.svg';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const LoginPage = () => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col px-16">
      <div className="relative flex w-full grow flex-col items-center justify-center gap-[2.25rem]">
        <Logo width={224.61} height={115.8} role="img" aria-label="SURF 어드민 로고" />
        <LoginForm />
      </div>
    </div>
  );
};
