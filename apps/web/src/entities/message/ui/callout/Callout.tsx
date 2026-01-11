import { Avatar } from '@surf/ui/avatar';

/**
 * Callout 컴포넌트
 * 쪽지 작성 시 수신자 정보를 표시하는 안내 컴포넌트
 * @param userImage - 사용자 프로필 이미지
 * @param userName - 사용자 이름
 */

export type CalloutProps = {
  userImage?: string;
  userName?: string;
};

const baseStyle =
  'bg-background-secondary-lighter flex w-full items-start gap-8 self-stretch px-13 py-10';

export function Callout({ userImage, userName }: CalloutProps) {
  return (
    <aside className={baseStyle} role="note" aria-label="쪽지 수신자 안내">
      <Avatar src={userImage} size="xs" alt="프로필 이미지" />

      <div className="flex flex-1 flex-col items-start justify-center gap-3">
        <div className="flex flex-1 flex-row items-start justify-center gap-3">
          <div className="text-foreground-normal text-body-body8">
            {userName ? userName : '테이비'}
          </div>
          <div className="text-foreground-normal text-body-body9">
            님에게 전달할 쪽지를 작성중이에요.
          </div>
        </div>
        <div className="text-foreground-normal text-body-body9">
          해당 쪽지는 상대방의 이메일로 전송됩니다!
        </div>
      </div>
    </aside>
  );
}
