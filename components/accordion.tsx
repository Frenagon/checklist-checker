'use client';

import type { ReactNode } from 'react';
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
  label: ReactNode;
  actions?: ReactNode;
  content: ReactNode;
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
            className="rounded-2xl border bg-background has-[.accordion-entry-trigger:focus-visible]:border-ring has-[.accordion-entry-trigger:focus-visible]:outline-3 has-[.accordion-entry-trigger:focus-visible]:outline-ring/30 has-[.accordion-entry-trigger:focus-visible]:outline-offset-[-3px]"
          >
            <Item className="relative min-h-12 gap-0 rounded-none border-none p-0">
              <AccordionPrimitive.Header className="flex min-w-0 flex-1">
                <AccordionPrimitive.Trigger className="accordion-entry-trigger group/accordion-entry flex min-h-12 min-w-0 flex-1 items-center gap-4 px-4 py-4 text-left text-base font-medium transition-all outline-none hover:underline disabled:pointer-events-none disabled:opacity-50">
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
              {entry.actions ? (
                <ItemActions className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  {entry.actions}
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
