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
    <div className="flex w-full gap-[0.62rem]">
      <time className="text-foreground-normal text-body-14-600--1-20">{date}</time>
      <div className="flex flex-1 flex-col">
        <div className="text-foreground-normal text-body-16-600--1 flex">
          <span className="flex-1">{category}</span>
          <span>{delta > 0 ? `+${delta}점` : `${delta}점`}</span>
        </div>
        <div className="text-foreground-hint text-body-14-400--2-22 flex">
          <span className="flex-1">{activity}</span>
          <span>{total}점</span>
        </div>
      </div>
    </div>
  );
};
