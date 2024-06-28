// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
   files: ['**/*.ts'],
   ignores: ['**/*.d.ts'],
   extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
   ],
   rules: {},
});
