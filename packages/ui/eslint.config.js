import { base } from '@surf/eslint-config/base';

export default [
  ...base({ tsconfigRootDir: import.meta.dirname, react: true }),
  // stories 파일 룰 완화
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'import-x/order': 'off',
      'react/function-component-definition': 'off',
    },
  },
];
