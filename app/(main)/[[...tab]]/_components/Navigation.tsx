'use client';

import { CalendarDays, ScanLine, Users } from 'lucide-react';
import {
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from '@/components/ui/animated-tabs';

export const navigationItems = [
  {
    value: 'scanner',
    href: '/scanner',
    label: 'Scanner',
    icon: ScanLine,
  },
  {
    value: 'attendance',
    href: '/attendance',
    label: 'Attendance',
    icon: Users,
  },
  {
    value: 'events',
    href: '/events',
    label: 'Events',
    icon: CalendarDays,
  },
] as const;

export type NavigationTabValue = (typeof navigationItems)[number]['value'];

export function getActiveTab(pathname: string): NavigationTabValue {
  return (
    navigationItems.find(
      ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
    )?.value ?? navigationItems[0].value
  );
}

interface NavigationProps {
  activeTab: NavigationTabValue;
}

export default function Navigation({ activeTab }: NavigationProps) {
  return (
    <nav className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <AnimatedTabsList
        aria-label="Primary navigation"
        className="grid h-auto w-full grid-cols-3 rounded-4xl border bg-muted/40 p-1"
        indicatorClassName="rounded-4xl border"
      >
        {navigationItems.map(({ value, label, icon: Icon }) => (
          <AnimatedTabsTrigger
            key={value}
            value={value}
            aria-current={activeTab === value ? 'page' : undefined}
            className="h-auto min-w-0 rounded-4xl px-2 py-2 text-xs leading-tight sm:px-4 sm:py-2.5 sm:text-sm [&_svg]:size-4"
          >
            <span className="flex min-w-0 flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
              <Icon aria-hidden="true" />
              <span className="truncate">{label}</span>
            </span>
          </AnimatedTabsTrigger>
        ))}
      </AnimatedTabsList>
    </nav>
  );
}
