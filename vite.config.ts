/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { wrapVinxiConfigWithSentry } from '@sentry/tanstackstart-react';

export default wrapVinxiConfigWithSentry(
  defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    // eslint-disable-next-line no-undef
    const env = loadEnv(mode, process.cwd(), '');

    // Inject env vars into process.env for server-side code
    // eslint-disable-next-line no-undef
    Object.assign(process.env, env);

    return {
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
    };
  })
);
