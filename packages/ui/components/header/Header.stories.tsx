import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  DefaultHeaderProps,
  Header,
  HeaderMode,
  HeaderProps,
  LogoHeaderProps,
  SearchBarHeaderProps,
  TextBtnHeaderProps,
} from './Header';
import { useState } from 'react';

const meta: Meta<HeaderProps> = {
  title: 'Shared/UI/Header',
  tags: ['autodocs'],
  component: Header,
  argTypes: {
    mode: {
      table: { disable: true },
    },
    onClickBack: {
      table: { disable: true },
    },
    onClickTextBtn: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    onSubmit: {
      table: { disable: true },
    },
  },
};

export default meta;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-[20rem] w-[20rem] bg-stone-100">{children}</div>
);

export const DefaultHeader: StoryObj<DefaultHeaderProps> = {
  render: (args) => (
    <Wrapper>
      <Header {...args} />
    </Wrapper>
  ),
  args: {
    mode: HeaderMode.Default,
    hasLeftIcon: true,
    onClickBack: () => alert('뒤로가기 클릭'),
    title: '홈',
    icons: [
      { label: 'Search', onClickIcon: () => alert('검색 클릭') },
      { label: 'Share', onClickIcon: () => alert('공유하기') },
      { label: 'DotsVertical', onClickIcon: () => alert('메뉴 열기') },
    ],
  },
};

export const LogoHeader: StoryObj<LogoHeaderProps> = {
  render: (args) => (
    <Wrapper>
      <Header {...args} />
    </Wrapper>
  ),
  args: {
    mode: HeaderMode.Logo,
    logo: <div className="flex h-full w-[8rem] items-center bg-gray-300" />,
    icons: [{ label: 'DotsVertical', onClickIcon: () => alert('메뉴 열기') }],
  },
};

export const TextBtnHeader: StoryObj<TextBtnHeaderProps> = {
  render: (args) => (
    <Wrapper>
      <Header {...args} />
    </Wrapper>
  ),
  args: {
    mode: HeaderMode.TextBtn,
    hasLeftIcon: true,
    onClickBack: () => alert('뒤로가기 클릭'),
    title: '글쓰기',
    text: '완료',
    isDisabled: false,
    onClickTextBtn: () => alert('완료 버튼 클릭'),
  },
};

export const SearchBarHeader: StoryObj<SearchBarHeaderProps> = {
  render: (args) => {
    const [query, setQuery] = useState('');
    return (
      <Wrapper>
        <Header
          {...args}
          mode={HeaderMode.SearchBar}
          value={query}
          onChange={setQuery}
          onSubmit={(val) => alert(`검색어 제출됨: ${val}`)}
        />
      </Wrapper>
    );
  },
  args: {
    hasLeftIcon: true,
    onClickBack: () => alert('뒤로가기 클릭'),
  },
  argTypes: {
    hasLeftIcon: { control: 'boolean' },
  },
};
