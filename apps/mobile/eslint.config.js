import { expo } from '@surf/eslint-config/expo';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  ...expo({
    tsconfigRootDir,
    project: ['./tsconfig.json'],
  }),
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
