import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
/**
 * @typedef {import('eslint/rules/stylistic-issues').StylisticIssues} StylisticIssues
 * @typedef {import('eslint-plugin-svelte/lib/rule-types').RuleOptions} SvelteRulesOptions
 * @typedef {{ [K in keyof StylisticIssues as `@stylistic/${K}`]: StylisticIssues[K] }} StylisticRules
 * @typedef {import('eslint/rules/possible-errors').PossibleErrors} PossibleErrors
 * @typedef {import('eslint/rules/best-practices').BestPractices} BestPractices
 * */

/** @type{StylisticRules} */
const stylisticRules = {
  '@stylistic/semi': ['error', 'always', { omitLastInOneLineBlock: true }],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/no-multiple-empty-lines': ['error'],
  '@stylistic/indent': ['error', 2],
};
/** @type{PossibleErrors & BestPractices} */
const jsRules = {
  'no-empty': ['error'],
  'no-empty-function': ['error'],
};
/** @type {SvelteRulesOptions} */
const svelteRules = {
  'svelte/indent': ['error', {
    indent: 2,
  }],
};

export default [
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...jsRules,
    },
  },
  ...tseslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/base'],
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: stylisticRules,
  },
  {
    files: ['**/*.svelte', '*.svelte'],
    rules: svelteRules,
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsparser,
      },
    },
  },
];
