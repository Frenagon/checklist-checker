import { Skeleton } from '@/components/ui/skeleton';

type EventAccordionItemSkeletonProps = {
  titleWidthClassName: string;
};

function EventAccordionItemSkeleton({
  titleWidthClassName,
}: EventAccordionItemSkeletonProps) {
  return (
    <div className="rounded-2xl border bg-background">
      <div className="relative flex min-h-12 items-center gap-4 px-4 py-4">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <Skeleton
          className={`h-5 flex-1 rounded-full sm:absolute sm:left-1/2 sm:max-w-[calc(100%-7rem)] sm:-translate-x-1/2 ${titleWidthClassName}`}
        />
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
        <Skeleton className="ml-auto size-8 rounded-full md:hidden" />
      </div>
    </div>
  );
}

export default function EventsPageSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <EventAccordionItemSkeleton titleWidthClassName="sm:w-44" />
        <EventAccordionItemSkeleton titleWidthClassName="sm:w-36" />
        <EventAccordionItemSkeleton titleWidthClassName="sm:w-40" />
      </div>
      <div className="rounded-2xl border bg-muted/50">
        <div className="flex min-h-12 items-center justify-center px-4 py-4">
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
    </section>
  );
}
