type ActivityHistoryItemProps = {
  date: string;
  category: string;
  activity?: string;
  delta: number; // 백엔드에서 양수/음수 모두 내려옴
  total: number;
};

export const ActivityHistoryItem = ({
  date,
  category,
  activity,
  delta,
  total,
}: ActivityHistoryItemProps) => {
  return (
    <div className="flex w-full gap-10">
      <time className="text-foreground-normal text-body-body7">{date}</time>
      <div className="flex flex-1 flex-col">
        <div className="text-foreground-normal text-body-body5 flex">
          <span className="flex-1">{category}</span>
          <span>{delta > 0 ? `+${delta}점` : `${delta}점`}</span>
        </div>
        <div className="text-foreground-tertiary text-body-body8 flex">
          <span className="flex-1">{activity}</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};
