'use client';

import { useCallback, useState } from 'react';
import {
  CopyIcon,
  MailIcon,
  MessageCircleMoreIcon,
  QrCodeIcon,
  Share2Icon,
} from 'lucide-react';
import { toast } from 'sonner';
import ErrorState from '@/components/error-state';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { useQueryWithStatus } from '@/hooks/useQueryWithStatus';
import { getActivityMarkAttendanceUrl } from '@/lib/event-links';
import { useQrCodePrint } from '@/lib/qr-code';
import { buildEmailShareUrl, buildWhatsAppShareUrl } from '@/lib/share-links';
import EmptyActivities from './EmptyActivities';
import EventActivitiesSkeleton from './EventActivitiesSkeleton';

type EventActivitiesProps = {
  eventId: Id<'events'>;
};

function ActivityQrButton({
  activityTitle,
  onPrintQr,
}: {
  activityTitle: string;
  onPrintQr: () => Promise<void>;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={`Print the attendance QR code for ${activityTitle}`}
          className="size-12 rounded-xl"
          onClick={() => {
            void onPrintQr();
          }}
          type="button"
          variant="outline"
        >
          <QrCodeIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Print attendance QR</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ActivityShareButton({
  activityTitle,
  attendanceUrl,
  onPrintQr,
}: {
  activityTitle: string;
  attendanceUrl: string;
  onPrintQr: () => Promise<void>;
}) {
  const handleEmailShare = useCallback(() => {
    window.location.href = buildEmailShareUrl(
      `Mark attendance for ${activityTitle}`,
      `Use this link to mark attendance for ${activityTitle}:\n\n${attendanceUrl}`,
    );
  }, [activityTitle, attendanceUrl]);

  const handleWhatsAppShare = useCallback(() => {
    window.open(
      buildWhatsAppShareUrl(
        `Mark attendance for ${activityTitle}: ${attendanceUrl}`,
      ),
      '_blank',
      'noopener,noreferrer',
    );
  }, [activityTitle, attendanceUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(attendanceUrl);
      toast.success('Attendance link copied to clipboard.');
    } catch {
      toast.error('Unable to copy the attendance link right now.');
    }
  }, [attendanceUrl]);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={`Share ${activityTitle}`}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <Share2Icon />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share activity</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>Share activity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleEmailShare}>
            <MailIcon />
            <span>Email</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleWhatsAppShare}>
            <MessageCircleMoreIcon />
            <span>WhatsApp</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              void handleCopyLink();
            }}
          >
            <CopyIcon />
            <span>Copy Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              void onPrintQr();
            }}
          >
            <QrCodeIcon />
            <span>QR Code</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ActivityRow({ activity }: { activity: Doc<'activities'> }) {
  const attendanceUrl = getActivityMarkAttendanceUrl(activity._id);
  const { handlePrint, printContent } = useQrCodePrint({
    title: `${activity.title} attendance`,
    subtitle: 'Scan this code to open the attendance page for this activity.',
    url: attendanceUrl,
  });

  const handlePrintQr = useCallback(async () => {
    try {
      await handlePrint();
    } catch {
      toast.error('Unable to print the attendance QR code right now.');
    }
  }, [handlePrint]);

  return (
    <>
      <Item variant="outline">
        <ActivityQrButton
          activityTitle={activity.title}
          onPrintQr={handlePrintQr}
        />
        <ItemContent>
          <ItemTitle>{activity.title}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ActivityShareButton
            activityTitle={activity.title}
            attendanceUrl={attendanceUrl}
            onPrintQr={handlePrintQr}
          />
        </ItemActions>
      </Item>
      {printContent}
    </>
  );
}

function EventActivitiesContent({
  eventId,
  onRetry,
}: EventActivitiesProps & {
  onRetry: () => void;
}) {
  const query = useQueryWithStatus(api.activities.getEventActivities, {
    eventId,
  });

  if (query.status === 'pending') {
    return <EventActivitiesSkeleton />;
  }

  if (query.status === 'error') {
    return (
      <ErrorState
        actionLabel="Try again"
        description="Something went wrong while loading this event's activities."
        onAction={onRetry}
        title="Unable to load activities"
      />
    );
  }

  if (query.data.length === 0) {
    return <EmptyActivities eventId={eventId} />;
  }

  return (
    <ItemGroup>
      {query.data.map((activity) => (
        <ActivityRow activity={activity} key={activity._id} />
      ))}
    </ItemGroup>
  );
}

export default function EventActivities({ eventId }: EventActivitiesProps) {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <EventActivitiesContent
      eventId={eventId}
      key={`${eventId}:${retryKey}`}
      onRetry={() => {
        setRetryKey((currentValue) => currentValue + 1);
      }}
    />
  );
}
