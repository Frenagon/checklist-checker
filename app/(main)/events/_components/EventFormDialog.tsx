'use client';

import type { ReactNode } from 'react';
import EventFormPage from '@/app/(main)/events/_components/EventFormPage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type EventFormDialogProps = {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function EventFormDialog({
  children,
  open,
  onOpenChange,
}: EventFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent
        className={cn(
          // Fullscreen on small devices...
          'inset-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none',
          // ...and the standard centered dialog from the sm breakpoint up.
          'sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-4xl',
        )}
      >
        <DialogTitle className="sr-only">Event Form</DialogTitle>
        <DialogDescription className="sr-only">
          Create or edit an event.
        </DialogDescription>
        <EventFormPage />
      </DialogContent>
    </Dialog>
  );
}
