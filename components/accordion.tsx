'use client';

import { Fragment } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import {
  AccordionContent,
  AccordionItem,
  Accordion as AccordionRoot,
} from '@/components/ui/accordion';
import { Item, ItemActions } from '@/components/ui/item';
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
            <Item className="gap-0 rounded-none border-none p-0">
              <AccordionPrimitive.Header className="flex min-w-0 flex-1">
                <AccordionPrimitive.Trigger className="group/accordion-entry flex min-h-14 min-w-0 flex-1 items-center gap-3.5 px-4 py-3.5 text-left text-sm font-medium transition-all outline-none hover:underline disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30">
                  <span
                    aria-hidden
                    className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
                  >
                    <ChevronDownIcon className="group-aria-expanded/accordion-entry:hidden" />
                    <ChevronUpIcon className="hidden group-aria-expanded/accordion-entry:block" />
                  </span>
                  <span className="min-w-0 flex-1 text-center leading-snug">
                    {entry.label}
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              {entry.actions?.length ? (
                <ItemActions className="shrink-0 pr-4 pl-3">
                  {entry.actions.map((action, index) => (
                    <Fragment key={`${entry.id}-action-${index}`}>
                      {action}
                    </Fragment>
                  ))}
                </ItemActions>
              ) : null}
            </Item>
            <AccordionContent>{entry.content}</AccordionContent>
          </AccordionItem>
        );
      })}
    </AccordionRoot>
  );
}
