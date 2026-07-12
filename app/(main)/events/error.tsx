'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">
        We couldn&apos;t load your events right now.
      </p>
      <div className="pt-2">
        <Button onClick={reset} type="button" variant="outline">
          Try again
        </Button>
      </div>
    </section>
  );
}
