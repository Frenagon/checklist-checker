import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmptyEvents from '@/app/(main)/events/_components/EmptyEvents';

const meta = {
  title: 'Events/EmptyEvents',
  component: EmptyEvents,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto flex w-full max-w-2xl flex-col py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyEvents>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
