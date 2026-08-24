import React, { ComponentProps } from 'react';
import { ButtonVariant, TextButton } from '../button/text-button/TextButton';
import { SurfIcon } from '../icon/SurfIcon';
import { TextInput } from '../text-input';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

// Header Mode
export enum HeaderMode {
  Default = 'default',
  Logo = 'logo',
  TextBtn = 'textBtn',
  SearchBar = 'searchBar',
}

type HeaderIcon = {
  label?: SurfIconName; // 아이콘 이름
  onClickIcon?: () => void; // 아이콘 클릭 시 이벤트
  isNew?: boolean; // 알림 배지 표시 여부
};

type MaxThree<T> = [] | [T] | [T, T] | [T, T, T];

type IconGroupProps = {
  icons?: MaxThree<HeaderIcon>; // 최대 3개까지 아이콘 표시 가능
};

// Header 타입별 Props
export type DefaultHeaderProps = {
  mode: HeaderMode.Default;
  hasLeftIcon?: boolean;
  onClickBack?: () => void;
  title?: string;
} & IconGroupProps;

export type LogoHeaderProps = {
  mode: HeaderMode.Logo;
  logo: React.ReactNode;
} & IconGroupProps;

export type TextBtnHeaderProps = {
  mode: HeaderMode.TextBtn;
  hasLeftIcon?: boolean;
  onClickBack?: () => void;
  title?: string;
  text: string;
  isDisabled?: boolean;
  btnVariant?: ButtonVariant;
  onClickTextBtn?: () => void;
};

export type SearchBarHeaderProps = {
  mode: HeaderMode.SearchBar;
  hasLeftIcon?: boolean;
  onClickBack?: () => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export type HeaderProps = (
  | DefaultHeaderProps
  | LogoHeaderProps
  | TextBtnHeaderProps
  | SearchBarHeaderProps
) & {
  className?: string;
};

const renderLeftIcon = (hasLeftIcon?: boolean, onClickBack?: () => void) =>
  hasLeftIcon && (
    <button
      className="-m-8 flex shrink-0 border-none bg-transparent p-8"
      onClick={onClickBack}
      type="button"
    >
      <SurfIcon name="ChevronLeft" size="l" className="text-foreground-normal" />
    </button>
  );

const renderTitle = (title?: string) =>
  title ? (
    <div className="text-title-title1 text-foreground-normal leading-14! ml-8 flex-1">{title}</div>
  ) : null;

const renderRightIcons = (icons: MaxThree<HeaderIcon> = []) => (
  <div className="ml-auto flex">
    {icons.map(
      (icon, idx) =>
        icon.label && (
          <button
            key={idx}
            className="relative -m-8 flex shrink-0 border-none bg-transparent p-8"
            onClick={icon.onClickIcon}
            type="button"
          >
            <SurfIcon name={icon.label} size="l" className="text-foreground-normal" />
            {icon.isNew && (
              <span className="bg-foreground-primary absolute right-8 top-8 h-7 w-7 rounded-full" />
            )}
          </button>
        ),
    )}
  </div>
);

// 헤더 높이는 3rem(48px)로 고정이고, 내용 높이에 맞춰 세로 패딩만 달라진다.
// - 아이콘/타이틀(24px) → py-11(12px) : 24 + 24 = 48
// - 검색창(36px)        → py-7(6px)   : 36 + 12 = 48
const paddingByMode: Record<HeaderMode, string> = {
  [HeaderMode.Default]: 'px-13 py-11',
  [HeaderMode.Logo]: 'px-13 py-11',
  [HeaderMode.TextBtn]: 'px-13 py-11',
  [HeaderMode.SearchBar]: 'py-7 pl-13 pr-11',
};

export const Header = ({ className, ...props }: HeaderProps) => {
  let content: React.ReactNode;

  switch (props.mode) {
    case HeaderMode.Default: {
      const { hasLeftIcon = false, onClickBack, title = '', icons } = props;
      content = (
        <>
          {renderLeftIcon(hasLeftIcon, onClickBack)}
          {renderTitle(title)}
          {renderRightIcons(icons ?? [])}
        </>
      );
      break;
    }

    case HeaderMode.Logo: {
      const { logo, icons } = props;
      content = (
        <>
          <div className="flex h-full flex-1">{logo}</div>
          {renderRightIcons(icons ?? [])}
        </>
      );
      break;
    }

    case HeaderMode.SearchBar: {
      const { hasLeftIcon = false, onClickBack, value, onChange, onSubmit } = props;
      content = (
        <>
          {renderLeftIcon(hasLeftIcon, onClickBack)}
          <div className="min-w-0 flex-1">
            <TextInput
              mode="search"
              value={value}
              onChange={onChange}
              onEnter={onSubmit}
              placeholder="검색어를 입력하세요."
              iconName="Search"
              onIconClick={() => onSubmit(value)}
            />
          </div>
        </>
      );
      break;
    }

    case HeaderMode.TextBtn: {
      const {
        hasLeftIcon = false,
        onClickBack,
        title = '',
        text,
        isDisabled,
        btnVariant = 'secondary',
        onClickTextBtn,
      } = props;
      content = (
        <>
          {renderLeftIcon(hasLeftIcon, onClickBack)}
          {renderTitle(title)}
          <div className="-my-7 ml-auto flex justify-center">
            <TextButton
              size="s"
              variant={btnVariant}
              isDisabled={isDisabled}
              onClick={onClickTextBtn}
            >
              {text}
            </TextButton>
          </div>
        </>
      );
      break;
    }

    default:
      content = null;
  }

  return (
    <header
      className={`app-header ${paddingByMode[props.mode]} top-0 flex h-[3rem] w-full shrink-0 items-center justify-between ${className ?? 'bg-background-normal'} border-border-normal border-b-[var(--stroke-weight-0)]`}
    >
      {content}
    </header>
  );
};
