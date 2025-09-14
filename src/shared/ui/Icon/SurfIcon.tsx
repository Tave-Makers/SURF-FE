import * as Icons from '@mynaui/icons-react';

type IconSize = 's' | 'm' | 'l';

interface IconProps {
  name: keyof typeof Icons;
  size?: IconSize;
  className?: string;
}

const sizeMap: Record<IconSize, number> = {
  s: 16,
  m: 20,
  l: 24,
};

const strokeMap: Record<IconSize, number> = {
  s: 1.2,
  m: 1.5,
  l: 1.5,
};

export const SurfIcon = ({ name, size = 'm', className }: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`'${name}' 아이콘이 없습니다`);
    return null;
  }

  // Solid 아이콘은 stroke 속성 적용 안함
  const isSolid = name.toLowerCase().includes('solid');

  return (
    <IconComponent
      size={sizeMap[size]}
      color="currentColor"
      className={`inline-block transition-colors duration-100 ${className ?? ''}`}
      {...(!isSolid && { stroke: strokeMap[size] })}
    />
  );
};
