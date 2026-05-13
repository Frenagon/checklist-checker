import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function updateUrl(pathname: string, mode: 'push' | 'replace') {
  const method =
    mode === 'replace'
      ? window.history.replaceState.bind(window.history)
      : window.history.pushState.bind(window.history);

  method(null, '', pathname);
}
