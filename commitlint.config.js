export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Surf 규칙: [type][nickname]: 메시지 (이슈번호는 선택)
    'header-pattern': [
      2,
      'always',
      /^\[(feat|fix|refactor|style|format|docs|chore|add|del|test)\]\[[a-z0-9_-]+\]: .+(?:\(#\d+\))?$/,
    ],
    'header-max-length': [2, 'always', 100],
  },
};
