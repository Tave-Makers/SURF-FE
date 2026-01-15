import { ActivityHistory } from '../model/types';
import { ActivityHistoryItem } from './ActivityHistoryItem';

type ActivityHistoryListProps = {
  records: ActivityHistory[];
};

export const ActivityHistoryList = ({ records }: ActivityHistoryListProps) => {
  return (
    <>
      {records.map((record, idx) => (
        <ActivityHistoryItem
          key={`${record.memberId}-${record.date}-${record.category}-${record.activity}-${idx}`}
          date={record.date}
          category={record.category}
          activity={record.activity}
          delta={record.delta}
          total={record.total}
        />
      ))}
    </>
  );
};
