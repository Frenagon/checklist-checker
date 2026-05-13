'use client';

import { use } from 'react';
import MainTabsShell from '@/app/(main)/[[...tab]]/_components/MainTabsShell';
import { navigationItems } from '@/app/(main)/[[...tab]]/_components/Navigation';

export default function MainPage({
  params,
}: {
  params: Promise<{ tab?: string[] }>;
}) {
  const { tab } = use(params);
  const pathname = tab?.[0] ? `/${tab[0]}` : navigationItems[0].href;

  return <MainTabsShell initialPathname={pathname} />;
}
