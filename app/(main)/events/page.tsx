'use client';

import { useQuery } from 'convex/react';
import CreateEventItem from '@/app/(main)/events/_components/CreateEventItem';
import EventActivities from '@/app/(main)/events/_components/EventActivities';
import EventIconButtons from '@/app/(main)/events/_components/EventIconButtons';
import EmptyEvents from '@/app/(main)/events/_components/EmptyEvents';
import EventsPageSkeleton from '@/app/(main)/events/_components/EventsPageSkeleton';
import { api } from '@/convex/_generated/api';
import { Accordion, type AccordionEntry } from '@/components/accordion';

export default function Events() {
  const events = useQuery(api.events.getMyEvents);

  if (events === undefined) {
    return <EventsPageSkeleton />;
  }

  if (events.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-col">
        <EmptyEvents />
      </section>
    );
  }

  const entries: AccordionEntry[] = events.map((event) => ({
    id: event._id,
    label: event.title,
    actions: <EventIconButtons eventId={event._id} />,
    content: <EventActivities eventId={event._id} />,
  }));

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Accordion entries={entries} />
      <CreateEventItem />
    </section>
  );
}
