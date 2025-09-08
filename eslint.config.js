// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import configPrettier from 'eslint-config-prettier';
import nextPlugin from '@next/eslint-plugin-next';
import storybook from 'eslint-plugin-storybook';

export default [
  // 1) .eslintignore 대체: lint 대상에서 완전히 제외
  {
    ignores: [
      // 빌드 산출물
      '.next/',
      'out/',
      'build/',
      'dist/',
      // 의존성
      'node_modules/',
      // 정적/문서/락파일 등
      'public/',
      'assets/',
      '*.svg',
      '*.ico',
      '*.json',
      '*.md',
      '*.lock',
      'pnpm-lock.yaml',
      // (선택) 설정 파일을 lint에서 제외하고 싶다면 아래 유지
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
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 3) 기본 JS/TS 권장 규칙
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 4) Next.js 권장 규칙
  // core-web-vitals preset을 적용하면 Next 공식 권장 규칙 세트가 들어옵니다.
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // 5) Storybook 권장 규칙 (Flat Config용)
  ...storybook.configs['flat/recommended'],

  // 6) Prettier: 마지막에 둬서 포맷 규칙 충돌 제거 + 플러그인 룰 적용
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  configPrettier,
];
