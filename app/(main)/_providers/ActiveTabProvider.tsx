'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  DEFAULT_TAB,
  getNavigationKeyFromPathname,
  type NavigationKey,
} from '@/app/(main)/_components/NavBar/navigation-config';

type ActiveTabContextValue = {
  activeTab: NavigationKey;
  setActiveTab: React.Dispatch<React.SetStateAction<NavigationKey>>;
};

const ActiveTabContext = React.createContext<ActiveTabContextValue | null>(null);

function getActiveTabFromPathname(pathname: string | null): NavigationKey {
  return getNavigationKeyFromPathname(pathname) ?? DEFAULT_TAB;
}

export default function ActiveTabProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = React.useState<NavigationKey>(() =>
    getActiveTabFromPathname(pathname),
  );

  React.useEffect(() => {
    setActiveTab(getActiveTabFromPathname(pathname));
  }, [pathname]);

  const value = React.useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab, setActiveTab],
  );

  return (
    <ActiveTabContext.Provider value={value}>
      {children}
    </ActiveTabContext.Provider>
  );
}

export function useActiveTab() {
  const context = React.useContext(ActiveTabContext);

  if (!context) {
    throw new Error('useActiveTab must be used within an ActiveTabProvider.');
  }

  return context;
}
