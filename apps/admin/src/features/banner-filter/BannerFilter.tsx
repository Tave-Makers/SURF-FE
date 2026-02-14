import { ChipToggle } from '@surf/ui/chip-toggle';

interface BannerFilterProps {
  currentFilter: 'all' | 'active' | 'inactive';
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
}

export const BannerFilter = ({ currentFilter, onFilterChange }: BannerFilterProps) => {
  const filterOptions = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '활성화' },
    { id: 'inactive', label: '비활성화' },
  ] as const;

  return (
    <div className="border-border-normal flex gap-10 border-b-[0.4px] px-13 pb-10">
      {filterOptions.map((opt) => (
        <ChipToggle
          key={opt.id}
          mode="text"
          highlightType="toggle"
          isClicked={currentFilter === opt.id}
          activeColor="blue"
          onToggleIcon={() => onFilterChange(opt.id)}
        >
          {opt.label}
        </ChipToggle>
      ))}
    </div>
  );
};
