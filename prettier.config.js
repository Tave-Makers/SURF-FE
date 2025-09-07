/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  // 한 줄의 최대 길이를 100자로 설정합니다.
  printWidth: 100,

  // 들여쓰기 크기를 2칸으로 설정합니다.
  tabWidth: 2,

  // 들여쓰기에 탭 대신 스페이스를 사용합니다.
  useTabs: false,

  // 코드 끝에 세미콜론을 추가합니다.
  semi: true,

  // 문자열에 작은따옴표를 사용합니다.
  singleQuote: true,

  // 객체나 배열의 마지막 요소 뒤에 쉼표를 항상 추가합니다.
  trailingComma: 'all',

  // 중괄호와 대괄호 사이에 공백을 추가합니다.
  bracketSpacing: true,

  // 화살표 함수의 매개변수에 항상 괄호를 추가합니다.
  arrowParens: 'always',

  // 줄바꿈 스타일을 'LF'로 설정하여 운영체제 간 문제를 방지합니다.
  endOfLine: 'lf',

  // JSX 안에서는 작은따옴표 대신 큰따옴표를 사용합니다.
  jsxSingleQuote: false,

  // Tailwind CSS 플러그인 추가
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
