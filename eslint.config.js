// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import configPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';

export default [
  // ESLint가 무시할 파일/폴더를 정의
  {
    ignores: ['.next', 'dist', 'build', 'coverage', 'node_modules'],
  },
  // 코드 실행 환경 및 전역 변수 설정
  {
    languageOptions: {
      // 전역 변수 설정 (브라우저, Node.js 환경)
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      // TypeScript 파서 설정
      parser: tseslint.parser,
      // TypeScript 파서 옵션
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // 기본 JavaScript 규칙 적용
  js.configs.recommended,
  // TypeScript 추천 규칙 적용
  ...tseslint.configs.recommended,
  // Prettier 플러그인과 규칙을 적용하여 코드 포맷팅
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
      // React 17+에서 JSX를 사용해도 React를 import하지 않아도 되므로 규칙 비활성화
      'react/react-in-jsx-scope': 'off',
      // 기본 ESLint의 'no-unused-vars' 규칙 비활성화 (TS 버전 사용)
      'no-unused-vars': 'off',
      // TypeScript의 사용하지 않는 변수 규칙 (접두사 '_'를 가진 변수는 무시)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // `next-env.d.ts` 파일에 대한 규칙 예외 처리
  {
    files: ['next-env.d.ts'],
    rules: {
      // Next.js가 자동으로 생성하는 파일이므로, triple-slash-reference 규칙을 무시
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  // eslint-config-prettier를 마지막에 추가하여 포맷팅 충돌 방지
  configPrettier,
];
