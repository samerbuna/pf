// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: ['/dist/*'],
};
