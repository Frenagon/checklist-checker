'use client';

import { useEffect, useState } from 'react';
import Navigation, {
  getActiveTab,
  navigationItems,
  type NavigationTabValue,
} from '@/app/(main)/[[...tab]]/_components/Navigation';
import {
  AnimatedTabs,
  AnimatedTabsContent,
} from '@/components/ui/animated-tabs';

interface MainTabsShellProps {
  initialPathname: string;
}

function PlaceholderSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </section>
  );
}

function updateUrl(pathname: string, mode: 'push' | 'replace') {
  const method =
    mode === 'replace'
      ? window.history.replaceState.bind(window.history)
      : window.history.pushState.bind(window.history);

  method(null, '', pathname);
}

export default function MainTabsShell({ initialPathname }: MainTabsShellProps) {
  const [activeTab, setActiveTab] = useState<NavigationTabValue>(() =>
    getActiveTab(initialPathname),
  );

  useEffect(() => {
    const isKnownPath = navigationItems.some(
      ({ href }) =>
        window.location.pathname === href ||
        window.location.pathname.startsWith(`${href}/`),
    );

    if (!isKnownPath || window.location.pathname === '/') {
      updateUrl(navigationItems[0].href, 'replace');
    }

    const syncFromUrl = () => {
      const pathname = window.location.pathname;
      const nextTab = getActiveTab(pathname);

      setActiveTab(nextTab);

      if (
        pathname === '/' ||
        !navigationItems.some(
          ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
        )
      ) {
        updateUrl(navigationItems[0].href, 'replace');
      }
    };

    window.addEventListener('popstate', syncFromUrl);

    return () => {
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  return (
    <AnimatedTabs
      value={activeTab}
      indicator="pill"
      contentAnimation="fade"
      className="gap-0"
      onValueChange={(nextValue) => {
        const nextTab = nextValue as NavigationTabValue;
        const item = navigationItems.find(({ value }) => value === nextTab);

        if (!item || item.value === activeTab) {
          return;
        }

        setActiveTab(nextTab);
        updateUrl(item.href, 'push');
      }}
    >
      <Navigation activeTab={activeTab} />
      <div className="px-4 py-6">
        <AnimatedTabsContent value="scanner">
          <PlaceholderSection
            title="Scanner"
            description="Scanner page placeholder. The scanning workflow will live here."
          />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="attendance">
          <PlaceholderSection
            title="Attendance"
            description="Attendance page placeholder. Attendance views and actions will live here."
          />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="events">
          <PlaceholderSection
            title="Events"
            description="Events page placeholder. Event management content will live here."
          />
        </AnimatedTabsContent>
      </div>
    </AnimatedTabs>
  );
}
