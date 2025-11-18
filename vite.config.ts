/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { wrapVinxiConfigWithSentry } from '@sentry/tanstackstart-react';

export default wrapVinxiConfigWithSentry(
  defineConfig({
    server: {
      port: 3000,
    },
    plugins: [tsConfigPaths(), tanstackStart(), react(), tailwindcss()],
    test: {
      environment: 'jsdom',
      setupFiles: [],
      passWithNoTests: true,
      coverage: {
        enabled: true,
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          ...coverageConfigDefaults.exclude,
          'examples',
          'routeTree.gen.ts',
          'tanstack-router.gen.ts',
        ],
      },
    },
  })
);
