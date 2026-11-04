import js from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import prettierRecommended from '@vue/eslint-config-prettier';
import globals from 'globals';

export default defineConfigWithVueTs(
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    // CommonJS config files run in Node
    files: ['**/*.cjs', '**/*.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      // require() is how CommonJS files import
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Runs Prettier as a lint rule (warnings) and turns off rules that conflict with it
  prettierRecommended
);
