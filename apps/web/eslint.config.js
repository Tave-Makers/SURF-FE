import { next } from '@surf/eslint-config/next';

export default [
  ...next({
    tsconfigRootDir: import.meta.dirname,
    project: './tsconfig.eslint.json',
  }),
  {
    files: ['.storybook/**/*.{ts,tsx,js,jsx}', 'svgr.d.ts', 'vitest.shims.d.ts'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
  {
    files: ['src/shared/store/bottomSheetStore.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
