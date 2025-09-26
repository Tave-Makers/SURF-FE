import { ActivityHistory } from '../model/types';
import { ActivityHistoryItem } from './ActivityHistoryItem';

type ActivityHistoryListProps = {
  records: ActivityHistory[];
};

export const ActivityHistoryList = ({ records }: ActivityHistoryListProps) => {
  return (
    <div className="flex w-full flex-col gap-[2.25rem] px-[1rem] pt-[1.88rem]">
      {records.map((record) => (
        <ActivityHistoryItem
          key={`${record.memberId}-${record.date}-${record.category}-${record.activity}`}
          date={record.date}
          category={record.category}
          activity={record.activity}
          delta={record.delta}
          total={record.total}
        />
      ))}
    </div>
  );
};
