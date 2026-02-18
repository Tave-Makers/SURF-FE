import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { ContentItem } from './ContentItem';

const meta: Meta<typeof ContentItem> = {
  title: 'Shared/Ui/ContentItem',
  component: ContentItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: { control: 'text' },
    imageUrl: { control: 'text' },
    hasThumbnail: { control: 'boolean' },
    isReorderMode: { control: 'boolean' },
    badge: { control: false },
    onClick: { action: 'click' },
  },
};

export default meta;

type Story = StoryObj<typeof ContentItem>;

const WithWidth = (args: React.ComponentProps<typeof ContentItem>) => (
  <div className="w-[360px]">
    <ContentItem {...args} />
  </div>
);

export const ActiveBadge: Story = {
  render: WithWidth,
  args: {
    name: 'BannerNameBannerNameBannerNameBannerName',
    hasThumbnail: true,
    isReorderMode: false,
    badge: { kind: 'active', active: true },
  },
};

export const InactiveBadge: Story = {
  render: WithWidth,
  args: {
    name: '비활성 배너',
    hasThumbnail: true,
    isReorderMode: false,
    badge: { kind: 'active', active: false },
  },
};

export const NoThumbnail: Story = {
  render: WithWidth,
  args: {
    name: '썸네일 없는 아이템',
    hasThumbnail: false,
    isReorderMode: false,
    badge: { kind: 'active', active: true },
  },
};

export const Playground: Story = {
  render: WithWidth,
  args: {
    name: 'Banner Name',
    hasThumbnail: true,
    isReorderMode: false,
    badge: { kind: 'active', active: true },
    onClick: () => {
      alert('배너 클릭');
    },
  },
};
