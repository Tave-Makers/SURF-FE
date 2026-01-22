import Logo from '../../../../../public/logo.svg';
import { LoginForm } from '@/entities/test/ui/LoginForm';

export const TestLoginPage = () => {
  return (
    <div className="flex h-dvh w-dvw flex-col px-16">
      <div className="relative flex w-full grow flex-col items-center justify-center gap-[2.25rem]">
        <Logo role="img" aria-label="SURF 로고" />
        <LoginForm />
      </div>
    </div>
  );
};
