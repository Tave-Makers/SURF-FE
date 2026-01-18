import Logo from '../../../../public/admin-logo.svg';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const LoginPage = () => {
  return (
    <div className="flex h-dvh w-dvw flex-col px-16">
      <div className="relative flex w-full grow flex-col items-center justify-center gap-[2.25rem]">
        <Logo width={224.61} height={115.8} />
        <LoginForm />
      </div>
    </div>
  );
};
