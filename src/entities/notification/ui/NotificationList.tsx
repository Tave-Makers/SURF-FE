import { NotificationItem, NotificationItemProps } from './NotificationItem';

type NotificationListProps = {
  items: NotificationItemProps[];
  onItemClick: (id: number, deepLink: string, isRead: boolean) => void;
};

export const NotificationList = ({ items, onItemClick }: NotificationListProps) => {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <NotificationItem
          key={item.id}
          {...item}
          onClick={() => onItemClick(item.id, item.deepLink, item.isRead)}
        />
      ))}
    </div>
  );
};
