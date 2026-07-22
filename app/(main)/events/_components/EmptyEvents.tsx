import { CalendarPlusIcon } from 'lucide-react';
import EventFormDialog from '@/app/(main)/events/_components/EventFormDialog';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

export type EmptyEventsProps = {
  className?: string;
};

export default function EmptyEvents({ className }: EmptyEventsProps) {
  return (
    <Empty className={cn('px-6 py-10 sm:px-12 sm:py-14', className)}>
      <EmptyHeader className="gap-3">
        <EmptyMedia variant="icon">
          <CalendarPlusIcon />
        </EmptyMedia>
        <EmptyTitle>You&apos;re ready to host an event</EmptyTitle>
        <EmptyDescription>
          Create your first event to start inviting people and tracking
          attendance.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EventFormDialog>
          <Button className="w-full sm:w-auto" size="lg">
            Create Event
          </Button>
        </EventFormDialog>
      </EmptyContent>
    </Empty>
  );
}
