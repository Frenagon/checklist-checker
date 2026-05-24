import { CalendarDays, ScanLine, Users } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from '@/components/ui/animated-tabs';

const navigationKeys = ['scanner', 'attendance', 'events'] as const;

export type NavigationKey = (typeof navigationKeys)[number];

type NavigationItem = {
  href: string;
  label: string;
  icon: typeof ScanLine;
};

export const navigationItems: Record<NavigationKey, NavigationItem> = {
  scanner: {
    href: '/scanner',
    label: 'Scanner',
    icon: ScanLine,
  },
  attendance: {
    href: '/attendance',
    label: 'Attendance',
    icon: Users,
  },
  events: {
    href: '/events',
    label: 'Events',
    icon: CalendarDays,
  },
};

export function isNavigationKey(value: string): value is NavigationKey {
  return navigationKeys.includes(value as NavigationKey);
}

export const DEFAULT_TAB: NavigationKey = 'scanner';

type NavigationProps = {
  activeTab: NavigationKey;
  setActiveTab: (tab: NavigationKey) => void;
};

export default function Navigation({
  activeTab,
  setActiveTab,
}: NavigationProps) {
  return (
    <nav className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <AnimatedTabs
          value={activeTab}
          indicator="pill"
          contentAnimation="fade"
          className="gap-0"
          onValueChange={(newTab) => {
            if (!isNavigationKey(newTab)) {
              notFound();
            }
            setActiveTab(newTab);
          }}
        >
          <AnimatedTabsList
            aria-label="Primary navigation"
            className="grid h-auto w-full grid-cols-3 rounded-4xl border bg-muted/40 p-1"
            indicatorClassName="rounded-4xl border"
          >
            {Object.entries(navigationItems).map(
              ([value, { href, label, icon: Icon }]) => (
                <AnimatedTabsTrigger
                  key={value}
                  value={value}
                  aria-current={activeTab === value ? 'page' : undefined}
                  className="h-auto min-w-0 rounded-4xl px-2 py-2 text-xs leading-tight sm:px-4 sm:py-2.5 sm:text-sm [&_svg]:size-4"
                  asChild
                >
                  <Link
                    href={href}
                    draggable="false"
                    className="select-none cursor-default"
                  >
                    <span className="flex min-w-0 flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                      <Icon aria-hidden="true" />
                      <span className="truncate">{label}</span>
                    </span>
                  </Link>
                </AnimatedTabsTrigger>
              ),
            )}
          </AnimatedTabsList>
        </AnimatedTabs>
      </div>
    </nav>
  );
}
