import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import { MemberCardBase } from '../MemberCardBase';
import type { MemberTrack } from '@/entities/member/model/types';

interface RemovableMemberCardProps {
  /** 멤버 ID */
  id: number;
  /** 멤버 이름 */
  name: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  /** 트랙 목록 (기수 + 파트) */
  tracks: MemberTrack[];
  /** 삭제 모드 활성화 여부 (true일 때 삭제 아이콘 표시) */
  isRemovalEnabled: boolean;
  /** 멤버 삭제 시 호출되는 콜백 */
  onRemoveMember: (memberId: number) => void;
}

/**
 * 삭제 가능한 멤버 카드.
 *
 * 삭제 아이콘을 클릭하면 onRemoveMember 콜백이 호출된다.
 * 삭제 아이콘 클릭은 stopPropagation으로 중복 클릭을 방지한다.
 */
export const RemovableMemberCard = ({
  id,
  name,
  profileImageUrl,
  tracks,
  isRemovalEnabled = false,
  onRemoveMember,
}: RemovableMemberCardProps) => {
  return (
    <MemberCardBase
      name={name}
      tracks={tracks}
      leftSlot={
        <div className="flex items-center gap-11">
          {isRemovalEnabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveMember(id);
              }}
              aria-label={`${name} 삭제`}
            >
              <SurfIcon name="MinusCircleSolid" size="l" className="fill-background-danger" />
            </button>
          )}
          <Avatar src={profileImageUrl} size="m" alt={`${name} 프로필 이미지`} />
        </div>
      }
    />
  );
};
