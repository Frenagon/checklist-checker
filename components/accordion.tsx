'use client';

import { Fragment } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import {
  AccordionContent,
  AccordionItem,
  Accordion as AccordionRoot,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Item, ItemActions } from '@/components/ui/item';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export type AccordionEntry = {
  id: string;
  label: React.ReactNode;
  actions?: React.ReactNode[];
  content: React.ReactNode;
};

export type AccordionProps = {
  entries: AccordionEntry[];
  className?: string;
};

export function Accordion({ entries, className }: AccordionProps) {
  return (
    <AccordionRoot
      type="single"
      collapsible
      className={cn(
        'gap-4 overflow-visible rounded-none border-none',
        className,
      )}
    >
      {entries.map((entry) => {
        return (
          <AccordionItem
            key={entry.id}
            value={entry.id}
            className="overflow-hidden rounded-2xl border bg-background"
          >
            <Item className="relative min-h-12 gap-0 rounded-none border-none p-0">
              <AccordionPrimitive.Header className="flex min-w-0 flex-1">
                <AccordionPrimitive.Trigger className="group/accordion-entry flex min-h-12 min-w-0 flex-1 items-center gap-4 px-4 py-4 text-left text-base font-medium transition-all outline-none hover:underline disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30">
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-8"
                  >
                    <ChevronDownIcon className="group-aria-expanded/accordion-entry:hidden" />
                    <ChevronUpIcon className="hidden group-aria-expanded/accordion-entry:block" />
                  </span>
                  <span className="absolute left-1/2 max-w-[calc(100%-7rem)] -translate-x-1/2 text-center text-base leading-snug">
                    {entry.label}
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              {entry.actions?.length ? (
                <>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        aria-label={`Open actions for ${entry.id}`}
                        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 md:hidden"
                        size="icon-sm"
                        variant="ghost"
                      >
                        <EllipsisVerticalIcon />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      className="inset-0 h-full w-full max-w-none border-0 md:hidden"
                      showCloseButton
                      side="bottom"
                    >
                      <SheetHeader className="pr-16">
                        <SheetTitle>{entry.label}</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 *:data-[slot=button]:w-full *:data-[slot=button]:justify-start">
                        {entry.actions.map((action, index) => (
                          <Fragment key={`${entry.id}-mobile-action-${index}`}>
                            {action}
                          </Fragment>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                  <ItemActions className="absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 md:flex">
                    {entry.actions.map((action, index) => (
                      <Fragment key={`${entry.id}-action-${index}`}>
                        {action}
                      </Fragment>
                    ))}
                  </ItemActions>
                </>
              ) : null}
            </Item>
            <AccordionContent>{entry.content}</AccordionContent>
          </AccordionItem>
        );
      })}
    </AccordionRoot>
  );
}
