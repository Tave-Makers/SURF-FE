import { Sheet, SheetItem } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import type { PostCategoryKey } from '@/entities/post/model/category';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    postCategory: Omit<PostCategoryBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

type CategoryOption = { key: string; label: string };

export type PostCategoryBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  category: PostCategoryKey;
  categories: readonly CategoryOption[];
  onSelect: (key: PostCategoryKey) => void;
  controlsId?: string;
};

export const PostCategoryBottomSheet = ({
  isOpen,
  onClose,
  category,
  categories,
  onSelect,
  controlsId,
}: PostCategoryBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby={controlsId}
      className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
    >
      <ModalSheet.Container>
        <ModalSheet.Content>
          <Sheet>
            <div id={controlsId} className="flex flex-col gap-5">
              {categories.map((item) => (
                <SheetItem
                  key={item.key}
                  title={item.label}
                  pressed={category === item.key}
                  onClick={() => onSelect(item.key as PostCategoryKey)}
                />
              ))}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
