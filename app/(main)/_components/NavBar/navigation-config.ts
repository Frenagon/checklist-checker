export const navigationKeys = ['scanner', 'attendance', 'events'] as const;

export type NavigationKey = (typeof navigationKeys)[number];

export function isNavigationKey(value: string): value is NavigationKey {
  return navigationKeys.includes(value as NavigationKey);
}

export function getNavigationKeyFromPathname(
  pathname: string | null | undefined,
): NavigationKey | null {
  const segment = pathname?.split('/')[1] ?? '';

  return isNavigationKey(segment) ? segment : null;
}

export const DEFAULT_TAB: NavigationKey = 'scanner';
