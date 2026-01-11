interface ShortcutProps {
  type: 'circle' | 'rectangle';
  label: string;
  imageSrc?: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

export const Shortcut = ({ type, label, imageSrc, onClick }: ShortcutProps) => {
  const SvgIcon = typeof imageSrc === 'function' ? imageSrc : null;

  if (type === 'circle') {
    return (
      <button className="flex w-full flex-col items-center gap-7" onClick={onClick}>
        <div className="h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full bg-gray-200">
          {SvgIcon && <SvgIcon aria-hidden="true" className="h-[40px] w-[40px]" />}
        </div>
        <span className="text-caption-caption6">{label}</span>
      </button>
    );
  }

  // rectangle
  return (
    <button
      className="bg-background-normal-lighter rounded-5 border-border-secondary flex w-full flex-col items-start overflow-hidden border shadow-[0_0_20px_3px_rgba(0,0,0,0.04)]"
      onClick={onClick}
    >
      {/* Label 영역 */}
      <div className="text-foreground-normal text-body-body5 px-13 pt-13">{label}</div>

      {/* 이미지 영역 */}
      <div className="w-full flex-1 bg-gray-200">
        {SvgIcon && <SvgIcon aria-hidden="true" className="h-full w-full" />}
      </div>
    </button>
  );
};
