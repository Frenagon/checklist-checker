import NavBar from '@/app/(main)/_components/NavBar/NavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-8">
        {children}
      </main>
    </div>
  );
}
