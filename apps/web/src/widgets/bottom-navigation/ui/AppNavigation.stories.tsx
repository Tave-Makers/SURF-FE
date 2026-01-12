import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppNavigation } from './AppNavigation';

const meta: Meta<typeof AppNavigation> = {
  title: 'Widgets/UI/BottomNavigation',
  component: AppNavigation,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AppNavigation>;

/**
 * Storybook에서 next/link 이동 막는 공통 Wrapper
 */
const PreventNavigation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      onClickCapture={(e) => {
        const target = e.target as HTMLElement;
        const a = target.closest('a');
        if (a) e.preventDefault();
      }}
    >
      {children}
    </div>
  );
};

export const HomeActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/home',
      },
    },
  },
  render: () => (
    <PreventNavigation>
      <AppNavigation />
    </PreventNavigation>
  ),
};

export const MypageActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/mypage',
      },
    },
  },
  render: () => (
    <PreventNavigation>
      <AppNavigation />
    </PreventNavigation>
  ),
};
