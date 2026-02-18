'use client';

import { Header, HeaderMode } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import { useBannerFromCache } from '@/features/banner/model/useGetBannerFromCache';
import { useBannerEdit } from '@/features/banner/model/useBannerEdit';
import { BannerFormWidget } from '@/widgets/banner/ui/BannerFormWidget';

interface BannerEditPageProps {
  bannerId: string;
}

export const BannerEditPage = ({ bannerId }: BannerEditPageProps) => {
  const router = useRouter();
  const { data: targetBanner } = useBannerFromCache(bannerId);

  const { state, actions } = useBannerEdit(bannerId, targetBanner);
  if (!targetBanner) {
    return <div>해당 배너를 찾을 수 없습니다.</div>;
  }
  if (state.isLoading) return <div>loading...</div>;
  return (
    <>
      <Header
        mode={HeaderMode.Default}
        title="배너 수정"
        hasLeftIcon
        onClickBack={() => router.back()}
      />
      <BannerFormWidget
        mode="edit"
        data={state.form}
        onChange={actions.setForm}
        onSelectFile={actions.setBannerFile}
        onSubmit={actions.handleOpenSaveAlert}
        onDelete={actions.handleOpenDeleteAlert}
        isSubmitting={state.isSubmitting}
        canSubmit={state.canSubmit}
        submitLabel="수정하기"
      />
    </>
  );
};
