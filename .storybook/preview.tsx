import '../app/globals.css';
import type { Preview } from '@storybook/nextjs-vite';
import { Geist_Mono, Noto_Sans } from 'next/font/google';
import ThemeProvider from '@/app/_providers/ThemeProvider';
import { cn } from '@/lib/utils';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div
          className={cn(
            'min-h-screen bg-background font-sans text-foreground antialiased',
            notoSans.variable,
            geistMono.variable,
          )}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Preview;

export default preview;
