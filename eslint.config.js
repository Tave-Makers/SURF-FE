// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import configPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import storybook from 'eslint-plugin-storybook';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // 1. .eslintignore 대체 (맨 위)
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

  // 2. 공통 언어 옵션
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

  // 3. 기본 JS 규칙
  js.configs.recommended,

  // 4. TypeScript 기본 규칙
  ...tseslint.configs.recommendedTypeChecked,

  // 5. Next.js & React 기본 규칙
  {
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: {} },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },

  // 6. Storybook 규칙
  ...storybook.configs['flat/recommended'],

  // 7. **커스텀 오버라이드 규칙 (모든 규칙을 덮어쓰므로 Prettier보다 먼저)**
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // 타입 정보를 가져올 모든 tsconfig.json 경로를 명시
        project: ['./tsconfig.json', './.storybook/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Next.js 13+에서는 필요 없음
      'react/react-in-jsx-scope': 'off',
      // TypeScript & JavaScript 공통: 타입스크립트 플러그인 규칙 사용
      'no-unused-vars': 'off', // 기본 규칙을 끕니다.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // TypeScript 파일에서 propTypes 경고 무시
      'react/prop-types': 'off',
    },
  },

  // 8. Prettier (포맷팅 규칙을 끄는 역할이므로, 모든 규칙 적용 후 위치)
  configPrettier,
];
