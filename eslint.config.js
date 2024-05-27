import pluginJs from "@eslint/js";
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always', {
        omitLastInOneLineBlock: true,
      }],
    },
  },
];
