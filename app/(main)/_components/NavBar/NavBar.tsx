'use client';

import Header from '@/app/(main)/_components/NavBar/Header/Header';
import Navigation from '@/app/(main)/_components/NavBar/Navigation';
import { useActiveTab } from '@/app/(main)/_providers/ActiveTabProvider';

export default function NavBar() {
  const { activeTab, setActiveTab } = useActiveTab();

  return (
    <>
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
