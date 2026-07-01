'use client';

import { Header, HeaderMode } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import { useBannerEdit } from '@/features/banner/model/useBannerEdit';
import { useBannerById } from '@/features/banner/model/useGetBannerById';
import { BannerFormWidget } from '@/widgets/banner/ui/BannerFormWidget';

interface BannerEditPageProps {
  bannerId: number;
}

export const BannerEditPage = ({ bannerId }: BannerEditPageProps) => {
  const router = useRouter();
  const { data: targetBanner } = useBannerById(bannerId);
  const { state, actions } = useBannerEdit(bannerId, targetBanner);

  return (
    <>
      <Header
        mode={HeaderMode.Default}
        title="배너 수정"
        hasLeftIcon
        onClickBack={() => router.back()}
      />
      {state.isLoading || !targetBanner ? (
        <div>{state.isLoading ? 'loading...' : '배너를 찾을 수 없습니다.'}</div>
      ) : (
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
      )}
    </>
  );
};
