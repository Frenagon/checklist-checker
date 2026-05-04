import convexPlugin from '@convex-dev/eslint-plugin';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  ...convexPlugin.configs.recommended,
]);
