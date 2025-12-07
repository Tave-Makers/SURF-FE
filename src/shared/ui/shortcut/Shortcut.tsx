import Image from 'next/image';

interface ShortcutProps {
  type: 'circle' | 'rectangle';
  label: string;
  image?: string;
}

export const Shortcut = ({ type, label, image }: ShortcutProps) => {
  if (type === 'circle') {
    return (
      <div className="flex flex-col items-center gap-7">
        <div className="h-[40px] w-[40px] overflow-hidden rounded-full bg-gray-200">
          {image && (
            <Image src={image} alt={label} width={40} height={40} className="object-cover" />
          )}
        </div>
        <span className="text-caption-caption6">{label}</span>
      </div>
    );
  }

  // rectangle
  return (
    <div className="bg-background-background-normal-lighter rounded-5 flex h-[150px] w-[105px] flex-col overflow-hidden">
      {/* Label 영역 */}
      <div className="text-foreground-foreground-normal text-body-body5 px-13 pt-13">{label}</div>

      {/* 이미지 영역 */}
      <div className="flex-1 bg-gray-200">
        {image && (
          <Image src={image} alt={label} width={105} height={110} className="h-full w-full" />
        )}
      </div>
    </div>
  );
};
