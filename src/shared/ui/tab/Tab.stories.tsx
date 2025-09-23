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
        defaultValue="photos"
        items={[
          { value: 'donation', label: '후원하기' },
          { value: 'photos', label: '사진첩' },
        ]}
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const ControlledWrapper = () => {
      const [tab, setTab] = useState('donation');
      return (
        <div className="p-4">
          <Tab
            value={tab}
            onValueChange={setTab}
            items={[
              { value: 'donation', label: '후원하기' },
              { value: 'photos', label: '사진첩' },
            ]}
          />
          <div className="mt-4">{tab === 'donation' ? '후원 탭' : '사진첩 탭'}</div>
        </div>
      );
    };
    return <ControlledWrapper />;
  },
};
