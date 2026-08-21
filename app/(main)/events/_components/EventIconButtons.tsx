'use client';

import {
  useCallback,
  useMemo,
  useState,
  type ComponentProps,
  type ComponentType,
} from 'react';
import {
  CopyIcon,
  EllipsisVerticalIcon,
  ListIcon,
  MailIcon,
  MessageCircleMoreIcon,
  PencilIcon,
  Share2Icon,
} from 'lucide-react';
import { toast } from 'sonner';
import EventAttendeesDialog from '@/app/(main)/events/_components/EventAttendeesDialog';
import EventFormDialog from '@/app/(main)/events/_components/EventFormDialog';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getEventSubscribeUrl } from '@/lib/event-links';
import { cn } from '@/lib/utils';

export type EventIconButtonsProps = {
  eventId: string;
  className?: string;
};

type ShareOption = {
  key: 'email' | 'whatsapp' | 'copy';
  label: string;
  icon: ComponentType<ComponentProps<'svg'>>;
  action: () => void | Promise<void>;
};

function buildEmailShareUrl(url: string) {
  return `mailto:?subject=${encodeURIComponent('Register for this event')}&body=${encodeURIComponent(`Use this link to register for the event:\n\n${url}`)}`;
}

function buildWhatsAppShareUrl(url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`Register for this event: ${url}`)}`;
}

export default function EventIconButtons({
  eventId,
  className,
}: EventIconButtonsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShareOpen, setIsMobileShareOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);

  const subscribeUrl = useMemo(() => getEventSubscribeUrl(eventId), [eventId]);

  const handleEmailShare = useCallback(() => {
    window.location.href = buildEmailShareUrl(subscribeUrl);
  }, [subscribeUrl]);

  const handleWhatsAppShare = useCallback(() => {
    window.open(
      buildWhatsAppShareUrl(subscribeUrl),
      '_blank',
      'noopener,noreferrer',
    );
  }, [subscribeUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(subscribeUrl);
      toast.success('Event link copied to clipboard.');
    } catch {
      toast.error('Unable to copy the event link right now.');
    }
  }, [subscribeUrl]);

  const shareOptions = useMemo<ShareOption[]>(
    () => [
      {
        key: 'email',
        label: 'Email',
        icon: MailIcon,
        action: handleEmailShare,
      },
      {
        key: 'whatsapp',
        label: 'WhatsApp',
        icon: MessageCircleMoreIcon,
        action: handleWhatsAppShare,
      },
      {
        key: 'copy',
        label: 'Copy Link',
        icon: CopyIcon,
        action: handleCopyLink,
      },
    ],
    [handleCopyLink, handleEmailShare, handleWhatsAppShare],
  );

  const handleMobileShareToggle = useCallback(() => {
    setIsMobileShareOpen((currentValue) => !currentValue);
  }, []);

  const handleMobileSheetChange = useCallback((open: boolean) => {
    setIsMobileMenuOpen(open);

    if (!open) {
      setIsMobileShareOpen(false);
    }
  }, []);

  const handleMobileShareAction = useCallback(
    async (action: ShareOption['action']) => {
      await action();
      setIsMobileMenuOpen(false);
      setIsMobileShareOpen(false);
    },
    [],
  );

  const handleEditOpen = useCallback(() => {
    setIsEventFormOpen(true);
  }, []);

  const handleMobileEditOpen = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileShareOpen(false);
    setIsEventFormOpen(true);
  }, []);

  const handleAttendeesOpen = useCallback(() => {
    setIsAttendeesOpen(true);
  }, []);

  const handleMobileAttendeesOpen = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileShareOpen(false);
    setIsAttendeesOpen(true);
  }, []);

  return (
    <div className={cn('flex items-center', className)}>
      <div className="hidden items-center gap-2 md:flex">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Share event"
                  size="icon-sm"
                  variant="outline"
                >
                  <Share2Icon />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share event</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuLabel>Share event</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {shareOptions.map(({ key, label, icon: Icon, action }) => (
                <DropdownMenuItem key={key} onSelect={action}>
                  <Icon />
                  <span>{label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="View attendees"
              onClick={handleAttendeesOpen}
              size="icon-sm"
              variant="ghost"
            >
              <ListIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View attendees</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Edit event"
              onClick={handleEditOpen}
              size="icon-sm"
              variant="ghost"
            >
              <PencilIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit event</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={handleMobileSheetChange}>
        <SheetTrigger asChild>
          <Button
            aria-label="Open event actions"
            className="md:hidden"
            size="icon-sm"
            variant="ghost"
          >
            <EllipsisVerticalIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="inset-0 h-full w-full max-w-none border-0 md:hidden"
          side="bottom"
        >
          <SheetHeader className="pr-16">
            <SheetTitle>Event actions</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-3 px-6 pb-6">
            <Button
              aria-expanded={isMobileShareOpen}
              className="w-full justify-start rounded-2xl"
              onClick={handleMobileShareToggle}
              variant="ghost"
            >
              <Share2Icon />
              <span>Share</span>
            </Button>

            {isMobileShareOpen ? (
              <div className="flex flex-col gap-2 rounded-3xl border bg-muted/30 p-2">
                {shareOptions.map(({ key, label, icon: Icon, action }) => (
                  <Button
                    key={key}
                    className="w-full justify-start rounded-2xl"
                    onClick={() => {
                      void handleMobileShareAction(action);
                    }}
                    variant="ghost"
                  >
                    <Icon />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            ) : null}

            <Button
              className="w-full justify-start rounded-2xl"
              onClick={handleMobileAttendeesOpen}
              variant="ghost"
            >
              <ListIcon />
              <span>Attendees</span>
            </Button>

            <Button
              className="w-full justify-start rounded-2xl"
              onClick={handleMobileEditOpen}
              variant="ghost"
            >
              <PencilIcon />
              <span>Edit</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <EventFormDialog
        onOpenChange={setIsEventFormOpen}
        open={isEventFormOpen}
      />

      <EventAttendeesDialog
        onOpenChange={setIsAttendeesOpen}
        open={isAttendeesOpen}
      />
    </div>
  );
}
