import type { Meta, StoryObj } from '@storybook/nextjs';
import { BadgeListItem } from './BadgeListItem';
import DEFAULT_BADGE_IMAGE from '@/shared/assets/images/default-item.png';

const meta: Meta<typeof BadgeListItem> = {
  title: 'Entities/UI/Badge/BadgeListItem',
  component: BadgeListItem,
  args: {
    badgeId: 1,
    imageUrl: DEFAULT_BADGE_IMAGE.src,
    name: '새로운 17기 환영',
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof BadgeListItem>;

export const Default: Story = {};
