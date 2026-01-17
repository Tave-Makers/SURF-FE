import Logo from '../../../../public/admin-logo.svg';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const LoginPage = () => {
  return (
    <div className="relative flex h-dvh w-dvw flex-col items-center gap-[2.25rem] px-16 pt-[16.81rem]">
      <Logo width={224.61} height={115.8} />
      <LoginForm />
    </div>
  );
};
