import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header, HeaderProps } from './Header';
import { useState } from 'react';

const meta: Meta<HeaderProps> = {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    type: {
      table: { disable: true },
    },
    onBack: {
      table: { disable: true },
    },
    onClick: {
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
type Story = StoryObj<HeaderProps>;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[20rem]">{children}</div>
);

export const DefaultHeader: Story = {
  render: (args: HeaderProps) => (
    <Wrapper>
      <Header {...args} />
    </Wrapper>
  ),
  args: {
    type: 'Default',
    hasLeftIcon: true,
    onBack: () => alert('뒤로가기 클릭'),
    hasTitle: true,
    title: '홈',
    icons: [
      { label: 'Search', onClick: () => alert('검색 클릭') },
      { label: 'Share', onClick: () => alert('공유하기') },
      { label: 'DotsVertical', onClick: () => alert('메뉴 열기') },
    ],
  },
};

export const LogoHeader: Story = {
  render: (args: HeaderProps) => (
    <Wrapper>
      <Header {...args} />
    </Wrapper>
  ),
  args: {
    type: 'Logo',
    logo: <div className="flex h-full w-[8rem] items-center bg-gray-300">로고</div>,
    icons: [{ label: 'DotsVertical', onClick: () => alert('메뉴 열기') }],
  },
  argTypes: {
    hasLeftIcon: { table: { disable: true } },
    title: { table: { disable: true } },
    hasTitle: { table: { disable: true } },
  },
};

export const TextBtnHeader: Story = {
  render: (args: HeaderProps) => (
    <Wrapper>
      <Header {...args} />
    </Wrapper>
  ),
  args: {
    type: 'TextBtn',
    hasLeftIcon: true,
    onBack: () => alert('뒤로가기 클릭'),
    hasTitle: true,
    title: '글쓰기',
    text: '완료',
    isActive: true,
    onClick: () => alert('완료 버튼 클릭'),
  },
};

export const SearchBarHeader: Story = {
  render: (args: HeaderProps) => {
    const [query, setQuery] = useState('');
    return (
      <Wrapper>
        <Header
          {...args} // ← Controls 반영
          type="SearchBar"
          value={query}
          onChange={setQuery}
          onSubmit={(val) => alert(`검색어 제출됨: ${val}`)}
        />
      </Wrapper>
    );
  },
  args: {
    hasLeftIcon: true,
    onBack: () => alert('뒤로가기 클릭'),
  },
  argTypes: {
    hasLeftIcon: { control: 'boolean' },
    title: { table: { disable: true } },
    hasTitle: { table: { disable: true } },
  },
};
