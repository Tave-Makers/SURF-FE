// AccordionGroup.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AccordionGroup } from './AccordionGroup';

const meta: Meta<typeof AccordionGroup> = {
  title: 'Shared/UI/Accordion/AccordionGroup',
  component: AccordionGroup,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AccordionGroup>;

export const GroupExample: Story = {
  args: {
    accordions: [
      {
        title: '첫 번째 아코디언',
        children: <p>여기에 자유롭게 ReactNode를 넣을 수 있습니다.</p>,
      },
      {
        title: '두 번째 아코디언',
        children: (
          <div style={{ padding: '1rem', background: '#f5f5f5' }}>
            임의의 콘텐츠 (예: 테이블, 이미지 등)
          </div>
        ),
      },
      {
        title: 'Disabled 아코디언',
        isDisabled: true,
        children: <p>비활성화 상태에서는 토글 불가</p>,
      },
    ],
  },
};
