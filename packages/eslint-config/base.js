// @ts-check
import path from 'node:path';

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import * as importX from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { fixupPluginRules } from '@eslint/compat';

/**
 * @param {{
 *  tsconfigRootDir: string,
 *  project?: string | string[],
 *  react?: boolean,
 *  ignores?: string[]
 * }} opts
 */
export function base(opts) {
  const { tsconfigRootDir, project, react = false, ignores = [] } = opts ?? {};
  const tsconfigProject = Array.isArray(project)
    ? project.map((item) => path.resolve(tsconfigRootDir, item))
    : project
      ? path.resolve(tsconfigRootDir, project)
      : undefined;

  const defaultIgnores = [
    '.next/',
    'out/',
    'build/',
    'dist/',
    'node_modules/',
    'public/',
    'assets/',
    'storybook-static/',
    'coverage/',
    'next-env.d.ts',
  ];

  return [
    { ignores: [...defaultIgnores, ...ignores] },

    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    js.configs.recommended,

    ...tseslint.configs.recommendedTypeChecked.map((c) => ({
      ...c,
      files: ['**/*.{ts,tsx}'],
    })),

    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          tsconfigRootDir,
          ...(tsconfigProject ? { project: tsconfigProject } : { projectService: true }),
        },
      },
    },

    // 설정 파일·스토리북 설정은 타입 기반 룰 제외
    // (extends는 plain 배열에서 동작하지 않으므로 스프레드로 적용)
    {
      ...tseslint.configs.disableTypeChecked,
      files: [
        '**/*.config.{js,mjs,cjs,ts,mts}',
        '**/.storybook/**/*.{js,ts}',
        '**/vitest.shims.d.ts',
      ],
    },

    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    },

    // import 룰: .ts 포함 전체로 확장
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      plugins: { 'import-x': importX },
      settings: {
        'import-x/resolver-next': [
          createTypeScriptImportResolver({
            project: tsconfigProject ?? tsconfigRootDir,
          }),
        ],
      },
      rules: {
        'import-x/no-unresolved': ['error', { ignore: ['^server-only$'] }],
        'import-x/no-default-export': 'error',
        'import-x/no-cycle': 'warn',
        'import-x/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true } }],
      },
    },

    // React 블록
    ...(react
      ? [
          {
            files: ['**/*.{tsx,jsx}'],
            plugins: {
              react: fixupPluginRules(reactPlugin),
              'react-hooks': reactHooksPlugin,
              'jsx-a11y': fixupPluginRules(jsxA11y),
            },
            settings: { react: { version: 'detect' } },
            rules: {
              ...reactPlugin.configs.recommended.rules,
              ...reactHooksPlugin.configs.recommended.rules,
              ...jsxA11y.configs.recommended.rules,
              'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
              'react/function-component-definition': [
                'error',
                { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
              ],
              'react/react-in-jsx-scope': 'off',
              'react/prop-types': 'off',
            },
          },
        ]
      : []),

    // Next/스토리 default export 허용
    {
      files: [
        '**/pages/**/*.{ts,tsx,js,jsx}',
        '**/app/**/{page,layout,template,default,loading,error,not-found,route}.{ts,tsx,js,jsx}',
        '**/app-pages/**/*.{ts,tsx,js,jsx}',
        '**/*.stories.{ts,tsx,js,jsx}',
        '**/*.config.{js,mjs,ts}',
        '**/src/test/**/*.{ts,tsx}',
        '**/*.test.{ts,tsx}',
      ],
      rules: { 'import-x/no-default-export': 'off' },
    },

    // scripts
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
