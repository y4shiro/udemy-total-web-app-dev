module.export = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detepted',
    },
  },
  rules: {
    semi: ['error', 'always'],
    'react/prop-types': false,
    '@typescript-eslint/explicit-function-return-type': false,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': ['error'],
    'no-use-before-define': false,
    '@typescript-eslint/no-use-before-define': ['error'],
  },
};
