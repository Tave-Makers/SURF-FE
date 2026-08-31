import Error404Icon from '@/shared/assets/icons/error/error-404.svg';

export const NotFoundErrorPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-11 text-center">
        <Error404Icon aria-hidden="true" />
        <p className="text-body-body8 text-foreground-tertiary">잘못된 페이지에요</p>
      </div>
    </div>
  );
};
