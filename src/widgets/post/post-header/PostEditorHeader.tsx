'use client';

import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';

type PostEditorHeaderProps = {
  mode: 'create' | 'edit';
  title: string;
  isContentEmpty: boolean;
  onSubmit: () => void | Promise<void>;
  onBack: () => void;
};

export function PostEditorHeader({
  mode,
  title,
  isContentEmpty,
  onSubmit,
  onBack,
}: PostEditorHeaderProps) {
  return (
    <AppHeader
      customBack={onBack}
      overrideHeader={{
        mode: HeaderMode.TextBtn,
        title: '공지사항',
        hasLeftIcon: true,
        text: mode === 'create' ? '등록' : '수정',
        btnVariant: 'secondary',
        isDisabled: !title || isContentEmpty,
        onClickTextBtn: () => void onSubmit(),
      }}
    />
  );
}
