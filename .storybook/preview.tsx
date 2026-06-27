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

type StorybookTheme = 'light' | 'dark' | 'system';

const preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for stories',
      defaultValue: 'system',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
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
    (Story, context) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        forcedTheme={
          context.globals.theme === 'system'
            ? undefined
            : (context.globals.theme as StorybookTheme)
        }
      >
        <div
          className={cn(
            'bg-background font-sans text-foreground antialiased',
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
