import Link from 'next/link';
import { Item } from '@/components/ui/item';

export default function CreateEventItem() {
  return (
    <Item
      asChild
      className="min-h-12 justify-center px-4 py-4 text-base font-medium hover:bg-muted/70"
      variant="muted"
    >
      <Link aria-label="Create event" href="/events/create">
        <span aria-hidden className="text-3xl leading-none">
          +
        </span>
      </Link>
    </Item>
  );
}
