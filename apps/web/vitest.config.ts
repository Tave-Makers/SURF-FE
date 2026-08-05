import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['./src/**/*.test.{ts,tsx}'],
  },
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: [
      { find: /^(.*)\.svg$/, replacement: path.resolve(__dirname, './src/test/mocks/index.ts') },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      {
        find: /^@surf\/ui\/store\/(.*)$/,
        replacement: path.resolve(__dirname, '../../packages/ui/store/$1'),
      },
      {
        find: /^@surf\/ui\/lib\/(.*)$/,
        replacement: path.resolve(__dirname, '../../packages/ui/lib/$1'),
      },
      {
        find: /^@surf\/ui\/hooks\/(.*)$/,
        replacement: path.resolve(__dirname, '../../packages/ui/hooks/$1'),
      },
      {
        find: /^@surf\/ui\/(.*)$/,
        replacement: path.resolve(__dirname, '../../packages/ui/components/$1'),
      },
    ],
  },
});
