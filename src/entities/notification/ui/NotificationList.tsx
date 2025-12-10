import { NotificationItem, NotificationItemProps } from './NotificationItem';

type NotificationListProps = {
  items: NotificationItemProps[];
};

export const NotificationList = ({ items }: NotificationListProps) => {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <NotificationItem key={index} {...item} />
      ))}
    </div>
  );
};
