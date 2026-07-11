import { ListTodoIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getEventEditPath } from '@/lib/event-links';
import { cn } from '@/lib/utils';

export type EmptyActivitiesProps = {
  eventId: string;
  className?: string;
};

export default function EmptyActivities({
  eventId,
  className,
}: EmptyActivitiesProps) {
  return (
    <Empty className={cn('px-6 py-10 sm:px-12 sm:py-14', className)}>
      <EmptyHeader className="gap-3">
        <EmptyMedia variant="icon">
          <ListTodoIcon />
        </EmptyMedia>
        <EmptyTitle>Your event needs activities</EmptyTitle>
        <EmptyDescription>
          Add activities to organize your event and start tracking attendance.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="w-full sm:w-auto" size="lg">
          <Link href={getEventEditPath(eventId)}>Add Activity</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
