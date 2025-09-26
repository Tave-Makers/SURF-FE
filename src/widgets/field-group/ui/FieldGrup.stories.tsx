import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FieldGroup } from './FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';

const meta: Meta<typeof FieldGroup> = {
  title: 'Widgets/UI/FieldGroup',
  component: FieldGroup,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    isRequired: { control: 'boolean' },
  },
  args: {
    title: '필드 그룹 제목',
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof FieldGroup>;

export const WithMultipleTextAreas: Story = {
  render: (args) => (
    <FieldGroup {...args} title="자기소개">
      <TextArea value="" onChange={() => {}} placeholder="한 줄 소개" />
      <TextArea value="" onChange={() => {}} placeholder="자세한 소개" />
    </FieldGroup>
  ),
};
