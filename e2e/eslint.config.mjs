import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{
		files: ['tests/**/*.ts', 'utils/**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'@stylistic': stylistic,
			'playwright': playwright
		},

		rules: {
			...playwright.configs['flat/recommended'].rules,
			"playwright/expect-expect": [
				"off",
			],
			'@stylistic/semi': 'error',
			'@stylistic/quotes': ['error', 'single'],
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			"@typescript-eslint/no-unsafe-call": "error",
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ 'argsIgnorePattern': '^_' }
			],
		},
	},
]);
/*
import typescript from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import typescriptParser from "@typescript-eslint/parser";
const { configs: typescriptConfigs } = typescript;

export default [
	{
		files: ["tests/*.ts"],
		plugins: {
			"@typescript-eslint": typescript,
			"playwright": playwright
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module"
			}
		},
		rules: {
			...typescriptConfigs.recommended.rules,
			...playwright.configs['flat/recommended'].rules,
			"no-console": "warn",
		}
	}
];*/
