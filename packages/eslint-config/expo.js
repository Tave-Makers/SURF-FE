// @ts-check
import configPrettier from 'eslint-config-prettier';

import { base } from './base.js';

/**
 * @param {{
 *  tsconfigRootDir: string,
 *  project?: string[],
 *  ignores?: string[]
 * }} opts
 */
export function expo(opts) {
  const { tsconfigRootDir, project = ['./tsconfig.json'], ignores = [] } = opts ?? {};

  return [
    ...base({
      tsconfigRootDir,
      project,
      ignores: ['.expo/', 'android/', 'ios/', 'app.json', 'babel.config.js', 'metro.config.js', ...ignores],
    }),

    {
      files: ['src/app/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },

    configPrettier,
  ];
}

export default expo;
