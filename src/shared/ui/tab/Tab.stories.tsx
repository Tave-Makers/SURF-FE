import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tab } from './Tab';
import { useState } from 'react';

const meta: Meta<typeof Tab> = {
  title: 'Shared/UI/Tab',
  component: Tab,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tab>;

export const Uncontrolled: Story = {
  render: () => (
    <div className="p-4">
      <Tab
        defaultValue="profile"
        items={[
          { value: 'profile', label: '프로필' },
          { value: 'badges', label: '활동뱃지' },
        ]}
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const ControlledWrapper = () => {
      const [tab, setTab] = useState('profile');
      return (
        <div className="p-4">
          <Tab
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'profile', label: '프로필' },
              { value: 'badges', label: '활동뱃지' },
            ]}
          />
          <div className="mt-4">{tab === 'profile' ? '프로필 탭' : '활동뱃지 탭'}</div>
        </div>
      );
    };
    return <ControlledWrapper />;
  },
};
