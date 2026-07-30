// @ts-check
import nextPlugin from '@next/eslint-plugin-next';
import storybook from 'eslint-plugin-storybook';
import configPrettier from 'eslint-config-prettier';

import { base } from './base.js';

export function next(opts) {
  const { tsconfigRootDir, storybook: enableStorybook = true, ignores = [] } = opts ?? {};

  return [
    ...base({ tsconfigRootDir, react: true, ignores }),
    {
      plugins: { '@next/next': nextPlugin },
      rules: { ...nextPlugin.configs['core-web-vitals'].rules },
    },
    ...(enableStorybook ? storybook.configs['flat/recommended'] : []),
    configPrettier,
  ];
}
