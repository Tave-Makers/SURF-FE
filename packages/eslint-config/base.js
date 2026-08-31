// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

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
    '**/.storybook/**',
    '.storybook/**',
    '*.svg',
    '*.ico',
    '*.md',
    '*.lock',
    'pnpm-lock.yaml',
    'next.config.js',
    'next-env.d.ts',
    'postcss.config.mjs',
    'tailwind.config.js',
    'prettier.config.mjs',
  ];

  return [
    // 1) ignores
    { ignores: [...defaultIgnores, ...ignores] },

    // 2) language options
    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },

    // 3) JS recommended
    js.configs.recommended,

    // 4) TS recommended
    ...tseslint.configs.recommended.map((c) => ({
      ...c,
      files: ['**/*.{ts,tsx}'],
    })),

    // 5) TS type-checked
    ...tseslint.configs.recommendedTypeChecked.map((c) => ({
      ...c,
      files: ['**/*.{ts,tsx}'],
    })),
    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project,
          tsconfigRootDir,
        },
      },
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

    // 6) React / a11y / import
    {
      files: ['**/*.{tsx,jsx}'],
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
        'jsx-a11y': jsxA11y,
        import: importPlugin,
      },
      settings: {
        react: { version: 'detect' },
        'import/resolver': { typescript: {} },
      },
      rules: {
        ...reactPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        ...jsxA11y.configs.recommended.rules,

        'func-style': 'off',
        'import/no-unresolved': ['error', { ignore: ['^server-only$'] }],
        'import/no-default-export': 'error',
        'import/no-cycle': 'warn',
        'import/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true } }],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
        'react/function-component-definition': [
          'error',
          { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
        ],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
    },

    // 6-1) Next page-level default export 허용
    {
      files: [
        '**/pages/**/*.{ts,tsx,js,jsx}',
        '**/app/**/page.{ts,tsx,js,jsx}',
        '**/app/**/layout.{ts,tsx,js,jsx}',
        '**/app/**/template.{ts,tsx,js,jsx}',
        '**/app/**/default.{ts,tsx,js,jsx}',
        '**/app/**/loading.{ts,tsx,js,jsx}',
        '**/app/**/error.{ts,tsx,js,jsx}',
        '**/app/**/global-error.{ts,tsx,js,jsx}',
        '**/app/**/not-found.{ts,tsx,js,jsx}',
        '**/app/**/route.{ts,tsx,js,jsx}',
        '**/app-pages/**/*.{ts,tsx,js,jsx}',
        '**/*.stories.{ts,tsx,js,jsx}',
      ],
      rules: { 'import/no-default-export': 'off' },
    },

    // 7) scripts는 any/unsafe 완화
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
