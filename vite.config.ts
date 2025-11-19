import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { wrapVinxiConfigWithSentry } from '@sentry/tanstackstart-react';
import { nitro } from 'nitro/vite';

export default wrapVinxiConfigWithSentry(
  defineConfig({
    server: {
      port: 3000,
    },
    plugins: [
      tanstackStart(),
      tsConfigPaths(),
      nitro(),
      react(),
      tailwindcss(),
    ],
  })
);
