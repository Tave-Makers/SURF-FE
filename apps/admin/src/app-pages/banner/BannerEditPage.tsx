'use client';

import { Header, HeaderMode } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import { useBannerEdit } from '@/features/banner/model/useBannerEdit';
import { BannerFormWidget } from '@/widgets/banner/ui/BannerFormWidget';

interface BannerEditPageProps {
  bannerId: string;
}

const MOCK_DATA = [
  { id: 1, name: '배너 1', imageUrl: '', isActive: true, linkUrl: '', displayOrder: 1 },
  { id: 2, name: '배너 2', imageUrl: '', isActive: true, linkUrl: '', displayOrder: 2 },
  { id: 3, name: '배너 3', imageUrl: '', isActive: false, linkUrl: '', displayOrder: 3 },
  { id: 4, name: '배너 4', imageUrl: '', isActive: true, linkUrl: '', displayOrder: 4 },
];

export const BannerEditPage = ({ bannerId }: BannerEditPageProps) => {
  const router = useRouter();
  const { state, actions } = useBannerEdit(bannerId, MOCK_DATA);

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
