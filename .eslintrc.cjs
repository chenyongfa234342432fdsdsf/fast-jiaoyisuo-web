module.exports = {
  root: true,
  extends: require.resolve('eslint-plugin-airbnb-react'),
  globals: {
    React: false,
  },
  settings: {
    'react': {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      alias: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
    'import/order': ['error'],
  },
  rules: {
    'react/no-unused-prop-types': [0],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    'react/no-unstable-nested-components': 'off',
    'react/jsx-no-bind': 'off',
    'jsx-a11y/media-has-caption': 'off',
  },
}
