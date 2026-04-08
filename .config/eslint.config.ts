// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier'
import tailwind from 'eslint-plugin-tailwindcss'
import withNuxt from '../.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'object-shorthand': ['error', 'always']
    }
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
).prepend([
  ...tailwind.configs['flat/recommended'],
  { settings: {
    tailwindcss: {
      config: '.config/tailwind.config.ts',
      whitelist: ['db-.+']
    }
  } }
]).append(eslintConfigPrettier)
