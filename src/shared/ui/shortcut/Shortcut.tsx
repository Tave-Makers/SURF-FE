import Image from 'next/image';

interface ShortcutProps {
  type: 'circle' | 'rectangle';
  label: string;
  imageSrc?: string;
}

export const Shortcut = ({ type, label, imageSrc }: ShortcutProps) => {
  if (type === 'circle') {
    return (
      <div className="flex flex-col items-center gap-7">
        <div className="h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full bg-gray-200">
          {imageSrc && (
            <Image src={imageSrc} alt={label} width={40} height={40} className="object-cover" />
          )}
        </div>
        <span className="text-caption-caption6">{label}</span>
      </div>
    );
  }

  // rectangle
  return (
    <div className="bg-background-normal-lighter rounded-5 border-border-secondary flex h-[9.375rem] w-[6.5625rem] flex-col overflow-hidden border">
      {/* Label 영역 */}
      <div className="text-foreground-normal text-body-body5 px-13 pt-13">{label}</div>

      {/* 이미지 영역 */}
      <div className="flex-1 bg-gray-200">
        {imageSrc && (
          <Image src={imageSrc} alt={label} width={105} height={110} className="h-full w-full" />
        )}
      </div>
    </div>
  );
};
