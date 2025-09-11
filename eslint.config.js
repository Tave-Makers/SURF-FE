// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import configPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import storybook from 'eslint-plugin-storybook';

export default [
  // 1) .eslintignore 대체
  {
    ignores: [
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
    ],
  },

  // 2) 공통 언어 옵션
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

  // 3) 기본 JS 규칙
  js.configs.recommended,

  // 4) TypeScript 파일 전용 설정
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[1].rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
    },
  },

  // 5) JavaScript 파일 전용 설정
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
    },
  },

  // 6) Next.js & React 규칙
  {
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  // 7) Storybook
  ...storybook.configs['flat/recommended'],

  // 8) Prettier (마지막)
  configPrettier,
];
