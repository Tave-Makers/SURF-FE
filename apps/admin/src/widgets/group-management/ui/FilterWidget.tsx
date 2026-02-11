import { ChipToggle } from '@surf/ui/chip-toggle';
import { Filter } from '@/entities/group-management/model/types';

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

const OPTIONS: Array<{ label: string; value: Filter }> = [
  { label: '전체', value: 'all' },
  { label: '스터디', value: 'study' },
  { label: '프로젝트', value: 'project' },
];

export const FilterWidget = ({ filter, onChange }: Props) => {
  return (
    <div className="flex gap-10 px-13 pb-10">
      {OPTIONS.map(({ label, value }) => (
        <ChipToggle
          key={value}
          mode="text"
          highlightType="toggle"
          isClicked={filter === value}
          onToggleIcon={() => onChange(value)}
          activeColor="blue"
        >
          {label}
        </ChipToggle>
      ))}
    </div>
  );
};
