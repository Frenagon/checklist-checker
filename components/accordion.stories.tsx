import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Accordion, type AccordionEntry } from '@/components/accordion';
import { Button } from '@/components/ui/button';

function renderPanel(
  overview: string,
  location: string,
  schedule: string[],
): React.ReactNode {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">Overview</h2>
        <p className="text-muted-foreground">{overview}</p>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">Location</h2>
        <p className="text-muted-foreground">{location}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">Schedule</h2>
        <ul className="flex flex-col gap-2 text-muted-foreground">
          {schedule.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const entries: AccordionEntry[] = [
  {
    id: 'spring-launch-planning',
    label: 'Spring Launch Planning',
    content: renderPanel(
      'Coordinate the kickoff presentation, attendee communications, and live checklist flow for the launch event.',
      'Main Hall',
      [
        '08:30 - Team setup and registration check',
        '09:00 - Welcome and event briefing',
        '09:30 - Product walkthrough and Q&A',
      ],
    ),
  },
  {
    id: 'community-workshop',
    label: 'Community Workshop',
    content: renderPanel(
      'Share facilitation notes, workshop materials, and the participation flow used by the staff team on-site.',
      'Studio B',
      [
        '10:00 - Facilitator check-in',
        '10:30 - Workshop introduction',
        '11:00 - Guided breakout sessions',
      ],
    ),
  },
];

const entriesWithActions: AccordionEntry[] = [
  {
    ...entries[0],
    actions: [
      <Button key="attendance" size="sm" variant="outline">
        Attendance
      </Button>,
      <Button key="scanner" size="sm" variant="ghost">
        Scanner
      </Button>,
    ],
  },
  {
    id: 'partner-roundtable',
    label: 'Partner Roundtable With A Longer Label',
    actions: [
      <Button key="scanner" size="sm" variant="outline">
        Scanner
      </Button>,
    ],
    content: renderPanel(
      'Review the session outline, speaker coordination notes, and attendee flow planned for the partner discussion.',
      'Conference Room 3',
      [
        '13:00 - Speaker arrival and setup',
        '13:30 - Roundtable introductions',
        '14:15 - Closing notes and follow-up capture',
      ],
    ),
  },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    entries,
  },
  argTypes: {
    className: {
      control: false,
    },
    entries: {
      control: false,
    },
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-4xl">
      <Accordion {...args} />
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const WithActions = {
  args: {
    entries: entriesWithActions,
  },
} satisfies Story;
