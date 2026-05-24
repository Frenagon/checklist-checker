import Image from 'next/image';
import Link from 'next/link';
import UserMenu from '@/app/(main)/_components/NavBar/Header/UserMenu';
import {
  DEFAULT_TAB,
  NavigationKey,
} from '@/app/(main)/_components/NavBar/Navigation';

export default function Header({
  setActiveTab,
}: {
  setActiveTab: (tab: NavigationKey) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center">
          <Link
            href={`/${DEFAULT_TAB}`}
            onClick={() => setActiveTab(DEFAULT_TAB)}
            aria-label="Go to the home page"
            className="shrink-0"
          >
            <Image
              src="/cheche-logo.png"
              width={1130}
              height={464}
              className="h-8 w-auto"
              alt="CheChe logo"
              priority
            />
          </Link>
        </div>

        <UserMenu />
      </div>
    </header>
  );
}
