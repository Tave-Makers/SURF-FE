import { base } from '@surf/eslint-config/base';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['.storybook/main.ts', '.storybook/preview.ts'],
  },

  ...base({
    tsconfigRootDir,
    project: ['./tsconfig.eslint.json'],
    react: true,
    storybook: true,
  }),

  {
    files: ['**/*.stories.@(ts|tsx|js|jsx)'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'import/order': 'off',
      'import/no-default-export': 'off',
      'react/function-component-definition': 'off',
    },
  },
];
