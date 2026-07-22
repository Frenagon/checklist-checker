import { ListTodoIcon } from 'lucide-react';
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

export type EmptyActivitiesProps = {
  eventId: string;
  className?: string;
};

export default function EmptyActivities({ className }: EmptyActivitiesProps) {
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
        <EventFormDialog>
          <Button className="w-full sm:w-auto" size="lg" variant="outline">
            Add Activity
          </Button>
        </EventFormDialog>
      </EmptyContent>
    </Empty>
  );
}
