'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  getNavigationKeyFromPathname,
  type NavigationKey,
} from '@/app/(main)/_components/NavBar/navigation-config';
import { useActiveTab } from '@/app/(main)/_providers/ActiveTabProvider';

export type ActiveTabLinkProps = React.ComponentProps<typeof Link> & {
  activeTab?: NavigationKey;
};

function getNavigationKeyFromHref(
  href: ActiveTabLinkProps['href'],
): NavigationKey | null {
  if (typeof href === 'string') {
    return getNavigationKeyFromPathname(href);
  }

  if (typeof href === 'object' && href.pathname) {
    return getNavigationKeyFromPathname(href.pathname);
  }

  return null;
}

export default function ActiveTabLink({
  activeTab,
  onClick,
  href,
  ...props
}: ActiveTabLinkProps) {
  const { setActiveTab } = useActiveTab();

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const nextActiveTab = activeTab ?? getNavigationKeyFromHref(href);

        if (nextActiveTab) {
          setActiveTab(nextActiveTab);
        }
      }}
      {...props}
    />
  );
}
