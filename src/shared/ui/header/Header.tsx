import React, { ComponentProps } from 'react';
import { SurfIcon } from '../icon/SurfIcon';
import { TextInput } from '../text-input/TextInput';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type BaseHeaderProps = {
  hasLeftIcon?: boolean;
  title?: string;
  onBack?: () => void;
};

type HeaderIcon = {
  label?: SurfIconName; // 아이콘 이름
  onClick?: () => void; // 아이콘 클릭 시 이벤트
};

type MaxThree<T> = [] | [T] | [T, T] | [T, T, T];

type IconGroupProps = {
  icons?: MaxThree<HeaderIcon>; // 최대 3개까지 아이콘 표시 가능
};

export type HeaderProps =
  | (BaseHeaderProps & { type: 'Default' } & IconGroupProps)
  | (BaseHeaderProps & { type: 'Logo'; logo: React.ReactNode } & IconGroupProps)
  | (BaseHeaderProps & { type: 'TextBtn'; text: string; isActive?: boolean; onClick?: () => void })
  | (BaseHeaderProps & {
      type: 'SearchBar';
      value: string;
      onChange: (value: string) => void;
      onSubmit: (value: string) => void;
    });

const renderLeftIcon = (hasLeftIcon?: boolean, onBack?: () => void) =>
  hasLeftIcon && (
    <button
      className="cursor-pointer border-none bg-transparent p-[0.5rem]"
      onClick={onBack}
      type="button"
    >
      <SurfIcon name="ChevronLeft" size="l" />
    </button>
  );

const renderTitle = (title?: string) => (
  <h1 className="text-head-18-700--1 flex-1 !leading-[18px]">{title}</h1>
);

const renderRightIcons = (icons: MaxThree<HeaderIcon> = []) => (
  <div className="ml-auto flex">
    {icons.map(
      (icon, idx) =>
        icon.label && (
          <button
            key={idx}
            className="cursor-pointer border-none bg-transparent p-[0.5rem]"
            onClick={icon.onClick}
            type="button"
          >
            <SurfIcon name={icon.label} size="l" />
          </button>
        ),
    )}
  </div>
);

export function Header({ hasLeftIcon = true, title = '', onBack, ...props }: HeaderProps) {
  const { type } = props;

  return (
    <header className="absolute top-0 flex h-[3rem] w-full items-center justify-between px-[0.5rem] py-[0.25rem]">
      {type === 'Default' && (
        <>
          {renderLeftIcon(hasLeftIcon, onBack)}
          {renderTitle(title)}
          {props.icons && renderRightIcons(props.icons)}
        </>
      )}

      {type === 'Logo' && (
        <>
          <div className="h-full flex-1">{props.logo}</div>
          {props.icons && renderRightIcons(props.icons)}
        </>
      )}

      {type === 'SearchBar' && (
        <>
          {renderLeftIcon(hasLeftIcon, onBack)}
          <TextInput
            mode="SearchField"
            value={props.value}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
          />
        </>
      )}

      {type === 'TextBtn' && (
        <>
          {renderLeftIcon(hasLeftIcon, onBack)}
          {renderTitle(title)}
          <button
            className={`text-body-14-600--1-20 ml-auto cursor-pointer p-[0.5rem] ${
              props.isActive
                ? 'text-[color:var(--color-foreground-normal)]'
                : 'text-[color:var(--color-background-quaternary)]'
            } `}
            onClick={props.onClick}
          >
            {props.text}
          </button>
        </>
      )}
    </header>
  );
}
