import React, { ComponentProps } from 'react';
import { SurfIcon } from '../icon/SurfIcon';
import { TextInput } from '../text-input/TextInput';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

// Header Mode
export enum HeaderMode {
  Default = 'default',
  Logo = 'logo',
  TextBtn = 'textBtn',
  SearchBar = 'searchBar',
}

// 공통 props
type BaseHeaderProps = {
  hasLeftIcon?: boolean;
  title?: string;
  onClickBack?: () => void;
};

type HeaderIcon = {
  label?: SurfIconName; // 아이콘 이름
  onClickIcon?: () => void; // 아이콘 클릭 시 이벤트
};

type MaxThree<T> = [] | [T] | [T, T] | [T, T, T];

type IconGroupProps = {
  icons?: MaxThree<HeaderIcon>; // 최대 3개까지 아이콘 표시 가능
};

// Header 타입별 Props
type DefaultHeaderProps = BaseHeaderProps & {
  mode: HeaderMode.Default;
} & IconGroupProps;

type LogoHeaderProps = BaseHeaderProps & {
  mode: HeaderMode.Logo;
  logo: React.ReactNode;
} & IconGroupProps;

type TextBtnHeaderProps = BaseHeaderProps & {
  mode: HeaderMode.TextBtn;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
};

type SearchBarHeaderProps = BaseHeaderProps & {
  mode: HeaderMode.SearchBar;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export type HeaderProps =
  | DefaultHeaderProps
  | LogoHeaderProps
  | TextBtnHeaderProps
  | SearchBarHeaderProps;

const renderLeftIcon = (hasLeftIcon?: boolean, onClickBack?: () => void) =>
  hasLeftIcon && (
    <button
      className="cursor-pointer border-none bg-transparent p-[0.5rem]"
      onClick={onClickBack}
      type="button"
    >
      <SurfIcon name="ChevronLeft" size="l" className="text-logo-normal" />
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
            onClick={icon.onClickIcon}
            type="button"
          >
            <SurfIcon name={icon.label} size="l" className="text-logo-normal" />
          </button>
        ),
    )}
  </div>
);

export function Header({ hasLeftIcon = true, title = '', onClickBack, ...props }: HeaderProps) {
  let content: React.ReactNode;

  switch (props.mode) {
    case HeaderMode.Default:
      content = (
        <>
          {renderLeftIcon(hasLeftIcon, onClickBack)}
          {renderTitle(title)}
          {renderRightIcons(props.icons)}
        </>
      );
      break;

    case HeaderMode.Logo:
      content = (
        <>
          <div className="h-full flex-1">{props.logo}</div>
          {renderRightIcons(props.icons)}
        </>
      );
      break;

    case HeaderMode.SearchBar:
      content = (
        <>
          {renderLeftIcon(hasLeftIcon, onClickBack)}
          <TextInput
            value={props.value}
            onChange={props.onChange}
            onEnter={props.onSubmit}
            placeholder="검색어를 입력하세요"
            iconName="Search"
            onIconClick={() => props.onSubmit(props.value)}
          />
        </>
      );
      break;

    case HeaderMode.TextBtn:
      content = (
        <>
          {renderLeftIcon(hasLeftIcon, onClickBack)}
          {renderTitle(title)}
          <button
            className={`text-body-14-600--1-20 ml-auto cursor-pointer p-[0.5rem] ${
              props.isActive
                ? 'text-[color:var(--color-foreground-normal)]'
                : 'text-[color:var(--color-background-quaternary)]'
            }`}
            onClick={props.onClick}
          >
            {props.text}
          </button>
        </>
      );
      break;

    default:
      content = null;
  }

  return (
    <header className="bg-background-normal-lighter absolute top-0 flex h-[3rem] w-full items-center justify-between px-[0.5rem] py-[0.25rem]">
      {content}
    </header>
  );
}
