// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * @param {{
 *  tsconfigRootDir: string,
 *  project?: string[],
 *  ignores?: string[]
 * }} opts
 */
export function base(opts) {
  const { tsconfigRootDir, project = ['./tsconfig.json'], ignores = [] } = opts ?? {};

  const defaultIgnores = [
    '.next/',
    'out/',
    'build/',
    'dist/',
    'node_modules/',
    'public/',
    'assets/',
    '*.svg',
    '*.ico',
    '*.json',
    '*.md',
    '*.lock',
    'pnpm-lock.yaml',
    'next.config.js',
    'next-env.d.ts',
    'postcss.config.mjs',
    'tailwind.config.js',
  ];

  return [
    // 1) ignores
    { ignores: [...defaultIgnores, ...ignores] },

    // 2) language options
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },

    // 3) JS
    js.configs.recommended,

    // 4) TS (type-checked 규칙 세트)
    ...tseslint.configs.recommendedTypeChecked,

    // 5) React / a11y + TS parserOptions(project)
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
        'jsx-a11y': jsxA11y,
        '@typescript-eslint': tseslint.plugin,
      },
      settings: {
        react: { version: 'detect' },
        'import/resolver': { typescript: {} },
      },
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project,
          tsconfigRootDir,
        },
      },
      rules: {
        ...reactPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        ...jsxA11y.configs.recommended.rules,

        'react/react-in-jsx-scope': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'react/prop-types': 'off',
      },
    },

    // 6) scripts any 허용
    {
      files: ['scripts/**/*.{ts,js}'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ];
}

export default base;
