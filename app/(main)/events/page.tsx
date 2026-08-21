'use client';

import { useState } from 'react';
import CreateEventItem from '@/app/(main)/events/_components/CreateEventItem';
import EmptyEvents from '@/app/(main)/events/_components/EmptyEvents';
import EventActivities from '@/app/(main)/events/_components/EventActivities';
import EventIconButtons from '@/app/(main)/events/_components/EventIconButtons';
import EventsPageSkeleton from '@/app/(main)/events/_components/EventsPageSkeleton';
import { Accordion, type AccordionEntry } from '@/components/accordion';
import ErrorState from '@/components/error-state';
import { api } from '@/convex/_generated/api';
import { useQueryWithStatus } from '@/hooks/useQueryWithStatus';

function EventsContent({ onRetry }: { onRetry: () => void }) {
  const query = useQueryWithStatus(api.events.getMyEvents, {});

  if (query.status === 'pending') {
    return <EventsPageSkeleton />;
  }

  if (query.status === 'error') {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-col">
        <ErrorState
          actionLabel="Try again"
          description="Something went wrong while loading your events."
          onAction={onRetry}
          title="Unable to load events"
        />
      </section>
    );
  }

  if (query.data.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-col">
        <EmptyEvents />
      </section>
    );
  }

  const entries: AccordionEntry[] = query.data.map((event) => ({
    id: event._id,
    label: event.title,
    actions: <EventIconButtons eventId={event._id} />,
    content: <EventActivities eventId={event._id} />,
  }));

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-6">
      <Accordion entries={entries} />
      <CreateEventItem />
    </section>
  );
}

export default function Events() {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <EventsContent
      key={retryKey}
      onRetry={() => {
        setRetryKey((currentValue) => currentValue + 1);
      }}
    />
  );
}
