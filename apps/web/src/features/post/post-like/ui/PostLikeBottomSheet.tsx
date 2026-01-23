import { Avatar } from '@surf/ui/avatar';
import { Sheet, SheetItem } from '@surf/ui/sheet';
import { useRouter } from 'next/navigation';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { PAGE_ROUTES } from '@/shared/config/path';

export type LikedUser = {
  id: number | null;
  name: string;
  profileImageUrl?: string;
};

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    postLike: Omit<PostLikeBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type PostLikeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  likedUsers: LikedUser[];
  isLoading: boolean;
  isError: boolean;
};

export const PostLikeBottomSheet = ({
  isOpen,
  onClose,
  likedUsers,
  isLoading,
  isError,
}: PostLikeBottomSheetProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet title="좋아요를 누른 사람">
            <div className="flex flex-col">
              {/* 로딩 */}
              {isLoading && <div className="py-4 text-center text-gray-500" />}

              {/* 에러 */}
              {isError && (
                <div className="py-4 text-center text-red-500">
                  좋아요 목록을 불러오지 못했습니다.
                </div>
              )}

              {/* 목록 */}
              {!isLoading &&
                !isError &&
                likedUsers.map((user, index) => {
                  if (!user.id) {
                    return (
                      <SheetItem
                        key={`withdrawn-${index}`}
                        title={user.name} // '탈퇴한 회원'으로 표시됨
                        node={<Avatar size="xs" className="rounded-3!" />}
                      />
                    );
                  }

                  return (
                    <SheetItem
                      key={user.id}
                      title={user.name}
                      node={<Avatar size="xs" src={user.profileImageUrl} className="rounded-3!" />}
                      onClick={() => {
                        router.push(PAGE_ROUTES.MEMBER.PROFILE(user.id!));
                        onClose();
                      }}
                    />
                  );
                })}

              {/* 비어 있을 때 */}
              {!isLoading && !isError && likedUsers.length === 0 && (
                <div className="py-4 text-center text-gray-500">좋아요가 없습니다.</div>
              )}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>

      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
