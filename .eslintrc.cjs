module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-refresh', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': ["error", { "endOfLine": "auto" }],
  },
  settings: {
    react: {
      version: 'detect'
    },
  },
}
