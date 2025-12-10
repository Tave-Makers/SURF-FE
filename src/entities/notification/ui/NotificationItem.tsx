import LikeNotificationBadge from '@/shared/assets/icons/notification/notification-badge-like.svg';
import MentionNotificationBadge from '@/shared/assets/icons/notification/notification-badge-mention.svg';
import { Avatar } from '@/shared/ui/avatar/Avatar';

type NOTIFICATION_BADGE = 'LIKE' | 'MENTION';

export type NotificationItemProps = {
  userImageUrl?: string;
  title: string;
  time: string;
  badge?: NOTIFICATION_BADGE;
  isRead: boolean;
};

export const NotificationItem = ({
  userImageUrl,
  title,
  time,
  badge,
  isRead,
}: NotificationItemProps) => {
  return (
    <div
      className={`p-[1rem] ${isRead ? 'bg-background-normal' : 'bg-background-notification'} flex items-center gap-[1.25rem]`}
    >
      {/* 아바타 + 뱃지 박스 */}
      {badge && (
        <div className="relative">
          <Avatar src={userImageUrl} size="m" />

          <div className="absolute right-[-5px] bottom-[-5px] h-[1.15rem] w-[1.15rem]">
            {badge === 'LIKE' && <LikeNotificationBadge className="h-full w-full" />}
            {badge === 'MENTION' && <MentionNotificationBadge className="h-full w-full" />}
          </div>
        </div>
      )}

      {/* 내용 */}
      <div className="flex flex-col gap-[0.375rem]">
        <h4 className="text-foreground-normal text-body-body7">{title}</h4>
        <span className="text-caption-caption4 text-foreground-quinary-darker">{time}</span>
      </div>
    </div>
  );
};
