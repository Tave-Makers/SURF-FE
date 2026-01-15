import { next } from '@surf/eslint-config/next';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

const config = next({
  tsconfigRootDir,
  project: ['./tsconfig.json', './.storybook/tsconfig.json'],
  storybook: true,
});

export default [
  ...config,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json'],
          tsconfigRootDir,
        },
      },
    },
  },
];
