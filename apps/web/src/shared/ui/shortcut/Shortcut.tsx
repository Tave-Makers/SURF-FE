interface ShortcutProps {
  type: 'circle' | 'rectangle';
  label: string;
  imageSrc: string;
  onClick?: () => void;
}

export const Shortcut = ({ type, label, imageSrc, onClick }: ShortcutProps) => {
  if (type === 'circle') {
    return (
      <button type="button" className="flex w-full flex-col items-center gap-7" onClick={onClick}>
        <div className="bg-background-normal h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full">
          <img src={imageSrc} alt={label} className="h-full w-full object-cover" />
        </div>
        <span className="text-caption-caption6">{label}</span>
      </button>
    );
  }

  // rectangle
  return (
    <button
      type="button"
      className="rounded-5 border-border-secondary shadow-lifted relative flex aspect-161/101 w-full overflow-hidden border"
      onClick={onClick}
    >
      <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <span className="text-foreground-normal text-body-body7 relative px-13 pt-13">{label}</span>
    </button>
  );
};
