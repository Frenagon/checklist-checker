'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/app/(main)/_components/NavBar/Header/Header';
import Navigation, {
  DEFAULT_TAB,
  isNavigationKey,
  NavigationKey,
} from '@/app/(main)/_components/NavBar/Navigation';

export default function NavBar() {
  const pathname = usePathname()?.split('/')[1] || '';
  const [activeTab, setActiveTab] = useState<NavigationKey>(
    isNavigationKey(pathname) ? pathname : DEFAULT_TAB,
  );

  return (
    <>
      <Header setActiveTab={setActiveTab} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
