import EventFormDialog from '@/app/(main)/events/_components/EventFormDialog';
import { Item } from '@/components/ui/item';

export default function CreateEventItem() {
  return (
    <EventFormDialog>
      <Item
        asChild
        className="min-h-12 justify-center px-4 py-4 text-base font-medium hover:bg-muted/70"
        variant="muted"
      >
        <button aria-label="Create event" type="button">
          <span aria-hidden className="text-3xl leading-none">
            +
          </span>
        </button>
      </Item>
    </EventFormDialog>
  );
}
