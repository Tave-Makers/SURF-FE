import * as Icons from '@mynaui/icons-react';
import { ComponentType } from 'react';

type IconSize = 's' | 'm' | 'l';
type IconName = Extract<keyof typeof Icons, string>;

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
  color?: string;
}

const sizeMap: Record<IconSize, number> = { s: 16, m: 20, l: 24 };
const strokeMap: Record<IconSize, number> = { s: 1.2, m: 1.5, l: 1.5 };

export const SurfIcon = ({
  name,
  size = 'm',
  className = '',
  color = 'currentColor',
}: IconProps) => {
  const icons = Icons as unknown as Record<string, ComponentType<BaseIconProps>>;
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`'${name}' 아이콘이 없습니다`);
    return null;
  }

  const isSolid = name.toLowerCase().includes('solid');

  return (
    <IconComponent
      size={sizeMap[size]}
      color={color}
      aria-hidden
      className={`inline-block transition-colors duration-200 ${className}`}
      {...(!isSolid && { stroke: strokeMap[size] })}
    />
  );
};
