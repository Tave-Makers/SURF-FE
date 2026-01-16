import type { StorybookConfig } from '@storybook/nextjs';
import type { Configuration, RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../assets'],

  webpackFinal: (config: Configuration) => {
    if (!config.module || !config.module.rules) {
      return config;
    }

    const imageRule = config.module.rules.find((rule) => {
      if (typeof rule !== 'object' || rule === null || !rule.test) {
        return false;
      }
      if (rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
      return false;
    }) as RuleSetRule | undefined;

    if (imageRule) {
      imageRule.exclude = /\.svg$/;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;
