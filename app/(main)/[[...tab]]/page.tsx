'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Navigation, {
  getActiveTab,
  navigationItems,
  type NavigationTabValue,
} from '@/app/(main)/[[...tab]]/_components/Navigation';
import {
  AnimatedTabs,
  AnimatedTabsContent,
} from '@/components/ui/animated-tabs';
import { updateUrl } from '@/lib/utils';

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

export default function MainPage() {
  const { tab } = useParams<{ tab?: string[] }>();
  const initialPathname = tab?.[0] ? `/${tab[0]}` : navigationItems[0].href;

  const [activeTab, setActiveTab] = useState<NavigationTabValue>(() =>
    getActiveTab(initialPathname),
  );

  useEffect(() => {
    const isKnownPath = navigationItems.some(
      ({ href }) => window.location.pathname === href,
    );

    console.log('Initial pathname:', window.location.pathname);
    if (window.location.pathname === '/') {
      updateUrl(navigationItems[0].href, 'replace');
    } else if (!isKnownPath) {
      notFound();
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
  }, [initialPathname]);

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
