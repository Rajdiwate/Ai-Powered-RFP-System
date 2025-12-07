import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      ...tsEslintPlugin.configs.recommended.rules, // TypeScript recommended rules
      ...configPrettier.rules, // disables conflicting rules

      // Base JavaScript rules
      'no-console': 'error',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-multiple-empty-lines': ['error', { max: 2 }], // Disallow multiple empty lines
      'no-var': 'error',

      // Prettier integration
      'prettier/prettier': 'error',

      // Import sorting rules
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^\\u0000'],
            ['^@?\\w'],
            ['^'],
            ['^\\.'],
            [
              '^@config',
              '^@constant',
              '^@core',
              '^@db',
              '^@middleware',
              '^@module',
              '^@type',
              '^@util',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },
];
