/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { coverageConfigDefaults } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: [],
    passWithNoTests: true,
    exclude: ['e2e/**', 'node_modules/**'],
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
});
