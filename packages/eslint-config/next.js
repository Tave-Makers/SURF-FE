// @ts-check
import nextPlugin from '@next/eslint-plugin-next';
import storybook from 'eslint-plugin-storybook';
import configPrettier from 'eslint-config-prettier';

import { base } from './base.js';

/**
 * @param {{
 *  tsconfigRootDir: string,
 *  project?: string[],
 *  storybook?: boolean,
 *  ignores?: string[]
 * }} opts
 */
export function next(opts) {
  const {
    tsconfigRootDir,
    project = ['./tsconfig.json', './.storybook/tsconfig.json'],
    storybook: enableStorybook = true,
    ignores = [],
  } = opts ?? {};

  return [
    ...base({ tsconfigRootDir, project, ignores }),

    // Next 규칙
    {
      plugins: {
        '@next/next': nextPlugin,
      },
      rules: {
        ...nextPlugin.configs['core-web-vitals'].rules,
      },
    },

    // Storybook 규칙(필요한 앱만)
    ...(enableStorybook ? [...storybook.configs['flat/recommended']] : []),

    // ✅ Prettier는 무조건 마지막
    configPrettier,
  ];
}

export default next;
