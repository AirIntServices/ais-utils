module.exports = {
  root: true,
  extends: [
    'airbnb/base',
    'plugin:promise/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'promise', 'prettier'],
  rules: {
    indent: ['off'], // trust prettier
    'import/prefer-default-export': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'no-use-before-define': ['off'],
    'no-restricted-globals': 'warn',
    'prefer-destructuring': 'off',
    'prefer-promise-reject-errors': 'warn',
    'promise/catch-or-return': 'warn',
    'promise/always-return': 'warn',
    'import/named': 'error',
    'import/no-cycle': 'off',
    'prettier/prettier': 'error',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft'], // This is to avoid being yelled at when using immer
      },
    ],
  },
  globals: {
    fetch: false,
  },
  // settings: {
  //   'import/resolver': {
  //     'babel-module': {
  //       extensions: ['.js'],
  //     },
  //   },
  // },
  env: {
    jest: true,
  },
};
