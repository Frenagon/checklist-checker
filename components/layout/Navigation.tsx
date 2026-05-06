'use client';

import { CalendarDays, ScanLine, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    href: '/scanner',
    label: 'Scanner',
    icon: ScanLine,
  },
  {
    href: '/attendance',
    label: 'Attendance',
    icon: Users,
  },
  {
    href: '/events',
    label: 'Events',
    icon: CalendarDays,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <div className="grid grid-cols-3 gap-1 rounded-4xl border bg-muted/40 p-1">
          {navigationItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex min-w-0 items-center justify-center gap-2 rounded-4xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
