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
      className="cursor-pointer border-none bg-transparent p-8"
      onClick={onClickBack}
      type="button"
    >
      <SurfIcon name="ChevronLeft" size="l" className="text-foreground-normal" />
    </button>
  );

const renderTitle = (title?: string) =>
  title ? (
    <div className="text-title-title1 text-foreground-normal leading-14! flex-1">{title}</div>
  ) : null;

const renderRightIcons = (icons: MaxThree<HeaderIcon> = []) => (
  <div className="ml-auto flex">
    {icons.map(
      (icon, idx) =>
        icon.label && (
          <button
            key={idx}
            className="cursor-pointer border-none bg-transparent p-8"
            onClick={icon.onClickIcon}
            type="button"
          >
            <SurfIcon name={icon.label} size="l" className="text-foreground-normal" />
          </button>
        ),
    )}
  </div>
);

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
          <div className="ml-auto flex justify-center">
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
      className={`px-13 top-0 flex h-[3rem] w-full items-center justify-between py-11 ${className ?? 'bg-background-normal'} border-border-normal border-b-[var(--stroke-weight-0)]`}
    >
      {content}
    </header>
  );
};
