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
import { cn } from '@/lib/utils';

export type ErrorStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export default function ErrorState({
  title,
  description,
  actionLabel = 'Try again',
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <Empty className={cn('px-6 py-10 sm:px-12 sm:py-14', className)}>
      <EmptyHeader className="gap-3">
        <EmptyMedia
          className="bg-destructive/10 text-destructive"
          variant="icon"
        >
          <CircleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onAction ? (
        <EmptyContent>
          <Button onClick={onAction} type="button" variant="outline">
            {actionLabel}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
