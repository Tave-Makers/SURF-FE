import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FieldGroup } from './FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';

const meta: Meta<typeof FieldGroup> = {
  title: 'Shared/UI/FieldGroup',
  component: FieldGroup,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    isRequired: { control: 'boolean' },
  },
  args: {
    title: '필드그룹 제목',
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof FieldGroup>;

export const WithMultipleTextAreas: Story = {
  args: {
    title: '자기소개',
  },
  render: (args) => {
    const [shortIntro, setShortIntro] = useState('');
    const [longIntro, setLongIntro] = useState('');

    return (
      <FieldGroup {...args}>
        <TextArea value={shortIntro} onChange={setShortIntro} placeholder="한 줄 소개" />
        <TextArea value={longIntro} onChange={setLongIntro} placeholder="자세한 소개" />
      </FieldGroup>
    );
  },
};
