'use client';

import EventIconButtons from '@/app/(main)/events/_components/EventIconButtons';
import EventAccordionPanel from '@/app/(main)/events/_components/EventAccordionPanel';
import { Accordion, type AccordionEntry } from '@/components/accordion';

const entries: AccordionEntry[] = [
  {
    id: 'spring-launch-planning',
    label: 'Spring Launch Planning',
    actions: <EventIconButtons eventId="spring-launch-planning" />,
    content: (
      <EventAccordionPanel
        overview="Coordinate the kickoff presentation, attendee communications, and live checklist flow for the launch event."
        location="Main Hall"
        schedule={[
          '08:30 - Team setup and registration check',
          '09:00 - Welcome and event briefing',
          '09:30 - Product walkthrough and Q&A',
        ]}
      />
    ),
  },
  {
    id: 'community-workshop',
    label: 'Community Workshop',
    actions: <EventIconButtons eventId="community-workshop" />,
    content: (
      <EventAccordionPanel
        overview="Share facilitation notes, workshop materials, and the participation flow used by the staff team on-site."
        location="Studio B"
        schedule={[
          '10:00 - Facilitator check-in',
          '10:30 - Workshop introduction',
          '11:00 - Guided breakout sessions',
        ]}
      />
    ),
  },
  {
    id: 'partner-roundtable',
    label: 'Partner Roundtable',
    actions: <EventIconButtons eventId="partner-roundtable" />,
    content: (
      <EventAccordionPanel
        overview="Review the session outline, speaker coordination notes, and attendee flow planned for the partner discussion."
        location="Conference Room 3"
        schedule={[
          '13:00 - Speaker arrival and setup',
          '13:30 - Roundtable introductions',
          '14:15 - Closing notes and follow-up capture',
        ]}
      />
    ),
  },
];

export default function Events() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col">
      <Accordion entries={entries} />
    </section>
  );
}
