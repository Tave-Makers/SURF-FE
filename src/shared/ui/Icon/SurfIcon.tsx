import * as Icons from '@mynaui/icons-react';
import { ComponentType } from 'react';

type IconSize = 's' | 'm' | 'l';

type IconComponents = typeof Icons;
type IconName = keyof IconComponents;

type BaseIconProps = {
  size?: number;
  stroke?: number;
  color?: string;
  className?: string;
};

interface IconProps {
  name: IconName;
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
  const IconComponent = Icons[name] as ComponentType<BaseIconProps>;

  if (!IconComponent) {
    console.warn(`'${name}' 아이콘이 없습니다`);
    return null;
  }

  // Solid 아이콘은 stroke 속성을 받지 않음
  const isSolid = name.toLowerCase().includes('solid');

  return (
    <IconComponent
      size={sizeMap[size]}
      color="currentColor"
      className={`inline-block transition-colors duration-200 ${className ?? ''}`}
      {...(!isSolid && { stroke: strokeMap[size] })}
    />
  );
};
