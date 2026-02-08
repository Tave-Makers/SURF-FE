import { base } from '@surf/eslint-config/base';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  ...base({
    tsconfigRootDir,
    project: ['./tsconfig.eslint.json'],
    react: true,
    storybook: false,
  }),
  {
    rules: {
      'next/no-html-link-for-pages': 'off',
    },
  },
];
