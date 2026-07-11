import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmptyActivities from '@/app/(main)/events/_components/EmptyActivities';

const meta = {
  title: 'Events/EmptyActivities',
  component: EmptyActivities,
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
  args: {
    eventId: 'spring-launch-planning',
  },
} satisfies Meta<typeof EmptyActivities>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
