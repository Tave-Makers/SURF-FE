interface ContentActiveBadgeProps {
  type: 'study' | 'project';
}

const CONTENT_STATE = {
  study: {
    label: '스터디',
    variantColor: 'bg-background-badge-pink text-foreground-badge-pink',
  },
  project: {
    label: '프로젝트',
    variantColor: 'bg-background-badge-purple text-foreground-badge-purple',
  },
} as const;

const baseClass = 'rounded-3 w-[3.4375rem] h-[1.1875rem] items-center flex justify-center';

export const ContentBadge = ({ type }: ContentActiveBadgeProps) => {
  const { label, variantColor } = type === 'study' ? CONTENT_STATE.study : CONTENT_STATE.project;
  return (
    <div className={`${baseClass} ${variantColor}`}>
      <span className="text-caption-caption5">{label}</span>
    </div>
  );
};
