import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/[.]**',
        '__tests__/**',
        '**/*.test.ts',
        'playground-builder/**',
        'dist/**',
        'node_modules/**',
        'build/**',
        'cli/**',
        'docs/**',
        'playground-assets/**',
        '**/interface.ts',
      ],
    },
  },

})
