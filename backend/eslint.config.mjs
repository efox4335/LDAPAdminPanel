import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import teslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores(['dist/*']),
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...teslint.configs.recommendedTypeChecked,
		],
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'@stylistic': stylistic,
		},

		rules: {
			'@stylistic/semi': 'error',
			'@stylistic/quotes': ['error', 'single'],
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ 'argsIgnorePattern': '^_' }
			],
		},
	},
]);
