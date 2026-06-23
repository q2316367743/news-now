import { defineConfig } from 'eslint/config'
import eslintPluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin'
import autoImportGlobals from './.eslintrc-auto-import.json' with { type: 'json' }

export default defineConfig(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },

  // Vue plugin + recommended rules
  {
    files: ['**/*.vue'],
    plugins: {
      vue: eslintPluginVue,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue'],
        parser: tsParser,
      }
    },
    rules: {
      ...eslintPluginVue.configs['flat/recommended'].rules,
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts'
          }
        }
      ],
    }
  },

  // TypeScript plugin + recommended rules
  {
    files: ['**/*.{ts,mts,tsx}'],
    plugins: {
      '@typescript-eslint': eslintPluginTypeScript,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...eslintPluginTypeScript.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },

  // Auto-import globals for TS and Vue files
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    languageOptions: {
      globals: autoImportGlobals.globals
    },
  }
)
