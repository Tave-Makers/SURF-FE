import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: [
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
