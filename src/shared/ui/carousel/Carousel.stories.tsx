import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel } from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Shared/UI/Carousel/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Carousel>;

const sampleImages = [
  { src: 'https://public.mujikorea.co.kr/images/plans/2510_men_bn_pc.jpg', alt: '샘플 이미지 1' },
  {
    src: 'https://public.mujikorea.co.kr/images/products/categories/kPekPdSyST6wgk6RqUVZz0JnquFG6rhmTmEjJL5H.jpg',
    alt: '샘플 이미지 2',
  },
  {
    src: 'https://public.mujikorea.co.kr/images/products/categories/mjPpw4Qa3Ds4faXJOmFhHIhD83YQqC88jPFYxbFZ.jpg',
    alt: '샘플 이미지 3',
  },
];

export const Default: Story = {
  args: {
    images: sampleImages,
    className: 'w-[300px] h-[150px]',
  },
};

export const Empty: Story = {
  name: 'Empty (No Images)',
  args: {
    images: [],
    className: 'w-[300px] h-[150px]',
  },
};

export const Single: Story = {
  name: 'Single Image',
  args: {
    images: [sampleImages[0]],
    className: 'w-[300px] h-[150px]',
  },
};
