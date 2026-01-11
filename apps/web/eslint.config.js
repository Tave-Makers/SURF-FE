import { next } from '@surf/eslint-config/next';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default next({
  tsconfigRootDir,
  project: ['./tsconfig.json', './.storybook/tsconfig.json'],
  storybook: true,
});
