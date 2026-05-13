import { Sheet } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    postCategory: Omit<PostCategoryBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type PostCategoryBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  category: PostCategoryKey;
  onSelect: (key: PostCategoryKey) => void;
  controlsId?: string;
};

export const PostCategoryBottomSheet = ({
  isOpen,
  onClose,
  category,
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
            <div id={controlsId} className="flex flex-col gap-5 py-15">
              {Object.values(POST_CATEGORIES).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.key)}
                  className={`rounded-md px-5 py-10 text-left transition-colors ${
                    category === item.key
                      ? 'bg-background-secondary font-semibold'
                      : 'hover:bg-background-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
