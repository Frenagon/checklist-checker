'use client';

import { CircleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col">
      <Empty className="px-6 py-10 sm:px-12 sm:py-14">
        <EmptyHeader className="gap-3">
          <EmptyMedia
            className="bg-destructive/10 text-destructive"
            variant="icon"
          >
            <CircleAlertIcon />
          </EmptyMedia>
          <EmptyTitle>Unable to load your events</EmptyTitle>
          <EmptyDescription>
            Something went wrong while loading this page. Please try again to
            continue managing your events.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={reset} type="button" variant="outline">
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
