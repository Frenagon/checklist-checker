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
      <DialogContent>
        <DialogTitle className="sr-only">Event Form</DialogTitle>
        <DialogDescription className="sr-only">
          Create or edit an event.
        </DialogDescription>
        <EventFormPage />
      </DialogContent>
    </Dialog>
  );
}
