import { Header, HeaderMode } from '@surf/ui/header';

interface BannerEditPageProps {
  bannerId: string;
}

export const BannerEditPage = ({ bannerId }: BannerEditPageProps) => {
  return (
    <div>
      <Header mode={HeaderMode.Default} title="배너 수정" hasLeftIcon />
      Banner Edit Page for Banner ID: {bannerId}
    </div>
  );
};
