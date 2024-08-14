import { config } from 'typescript-eslint';
import tseslint from 'typescript-eslint';

export default config({
  files: ['**/*.ts'],
  ignores: ['node_modules', 'build', '*.md'],
  extends: [...tseslint.configs.recommended],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      project: 'tsconfig.eslint.json',
      sourceType: 'module',
    },
  },
  rules: {
    indent: ['error', 2],
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'no-console': 'error',
  },
});
