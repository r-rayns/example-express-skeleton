import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, '@stylistic':stylistic },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    },
  },
  ...tseslint.configs.recommended,
]);
