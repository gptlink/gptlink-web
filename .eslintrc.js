module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'tailwindcss'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'tailwindcss/no-custom-classname': 'off',
  },
};
