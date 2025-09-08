export default {
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^\[(?<type>feat|fix|refactor|style|format|docs|chore|add|del|test)\]\[(?<nickname>[a-z0-9_-]+)\]: (?<subject>.+)$/,
      headerCorrespondence: ['type', 'nickname', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'style', 'format', 'docs', 'chore', 'add', 'del', 'test'],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
  },
};
