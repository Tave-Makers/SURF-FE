import Link from 'next/link';
import ErrorPageIcon from '@/shared/assets/icons/error-page-icon.svg';
import { PAGE_ROUTES } from '@/shared/config/path';

export const UnauthorizedPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-16 text-center">
        <div className="flex flex-col items-center gap-11">
          <ErrorPageIcon aria-hidden="true" />
          <p className="text-body-body8 text-foreground-tertiary">접근 권한이 없어요</p>
        </div>
        <Link
          href={PAGE_ROUTES.HOME}
          className="text-body-body6 rounded-3 bg-background-primary text-foreground-static-white hover:bg-background-primary-darker inline-flex items-center justify-center overflow-hidden p-9"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
};
