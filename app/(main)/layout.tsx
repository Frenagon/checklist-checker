'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/app/(main)/_components/Header/Header';
import Navigation, {
  isNavigationKey,
  navigationItems,
  NavigationKey,
} from '@/app/(main)/_components/Navigation';

export const DEFAULT_TAB = Object.keys(navigationItems)[0] as NavigationKey;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()?.split('/')[0] || '';
  const [activeTab, setActiveTab] = useState<NavigationKey>(
    isNavigationKey(pathname) ? pathname : DEFAULT_TAB,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header setActiveTab={setActiveTab} />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-8">
        {children}
      </main>
    </div>
  );
}
