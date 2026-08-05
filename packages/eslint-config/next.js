// @ts-check
import nextPlugin from '@next/eslint-plugin-next';
import storybook from 'eslint-plugin-storybook';
import configPrettier from 'eslint-config-prettier';

import { base } from './base.js';

/**
 * @param {{
 *  tsconfigRootDir: string,
 *  project?: string | string[],
 *  storybook?: boolean,
 *  ignores?: string[]
 * }} opts
 */
export function next(opts) {
  const { tsconfigRootDir, project, storybook: enableStorybook = true, ignores = [] } = opts ?? {};

  return [
    ...base({ tsconfigRootDir, project, react: true, ignores }),
    {
      plugins: { '@next/next': nextPlugin },
      rules: {
        ...nextPlugin.configs['core-web-vitals'].rules,
        '@next/next/no-html-link-for-pages': 'off', // App Router — Pages 전용 룰
      },
    },
    ...(enableStorybook ? storybook.configs['flat/recommended'] : []),
    configPrettier,
  ];
}
