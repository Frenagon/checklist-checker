'use client';

import ErrorState from '@/components/error-state';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col">
      <ErrorState
        description="Something went wrong while loading this page. Please try again to continue managing your events."
        onAction={reset}
        title="Unable to load your events"
      />
    </section>
  );
}
