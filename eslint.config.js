/**
 *  ESLint configuration for version 9.x
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.node },
    },
])
