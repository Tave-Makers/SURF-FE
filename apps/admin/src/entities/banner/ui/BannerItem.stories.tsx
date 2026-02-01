import type { Meta, StoryObj } from '@storybook/nextjs';
import { BannerItem } from './BannerItem';

const meta: Meta<typeof BannerItem> = {
  title: 'Entities/Ui/Banner/BannerItem',
  component: BannerItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    id: { control: false },
    imageUrl: { control: 'text' },
    name: { control: 'text' },
    isActive: { control: 'boolean' },
    onClickMore: { action: 'click more' },
  },
};

export default meta;

type Story = StoryObj<typeof BannerItem>;

const WithWidth = (args: React.ComponentProps<typeof BannerItem>) => (
  <div className="w-[360px]">
    <BannerItem {...args} />
  </div>
);

export const Active: Story = {
  render: WithWidth,
  args: {
    id: 1,
    name: 'BannerNameBannerNameBannerNameBannerName',
    isActive: true,
    imageUrl: '',
  },
  parameters: {
    controls: { exclude: ['id', 'imageUrl', 'name', 'isActive', 'onClickMore'] },
  },
};

export const Inactive: Story = {
  render: WithWidth,
  args: {
    id: 2,
    name: '비활성 배너',
    isActive: false,
    imageUrl: '',
  },
  parameters: {
    controls: { exclude: ['id', 'imageUrl', 'name', 'isActive', 'onClickMore'] },
  },
};

export const Playground: Story = {
  render: WithWidth,
  args: {
    id: 1,
    name: 'Banner Name',
    isActive: true,
    imageUrl: '',
  },
};
