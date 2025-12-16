module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/'],
};
