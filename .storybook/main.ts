import type { StorybookConfig } from '@storybook/nextjs-vite';

const config = {
  stories: ['../**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
} satisfies StorybookConfig;

export default config;
