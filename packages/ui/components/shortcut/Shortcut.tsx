interface ShortcutProps {
  type: 'circle' | 'rectangle';
  label: string;
  imageSrc: string;
  onClick?: () => void;
}

export const Shortcut = ({ type, label, imageSrc, onClick }: ShortcutProps) => {
  if (type === 'circle') {
    return (
      <button className="flex w-full flex-col items-center gap-7" onClick={onClick}>
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
      className="bg-background-normal-lighter rounded-5 border-border-secondary flex aspect-[7/10] w-full flex-col items-start overflow-hidden border shadow-[var(--effect-shadow-lifted-x-normal,0)_var(--effect-shadow-lifted-y-normal,0)_var(--effect-shadow-lifted-blur,20px)_var(--effect-shadow-lifted-spread,6px)_rgba(0,0,0,0.04)]"
      onClick={onClick}
    >
      {/* Label 영역 */}
      <div className="text-foreground-normal text-body-body5 px-13 pt-13">{label}</div>

      {/* 이미지 영역 */}
      <div className="bg-background-normal-lighter rounded-b-5 aspect-[21/22] w-full flex-1">
        <img src={imageSrc} alt={label} className="h-full w-full object-cover" />
      </div>
    </button>
  );
};
