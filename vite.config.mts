import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/[.]**',
        '__tests__/**',
        '**/*.test.ts',
        'playgroundBuilder/**',
        'dist/**',
        'node_modules/**',
        'build/**',
        'cli/**',
        'docs/**',
        'playgroundAssets/**',
        '**/interface.ts',
      ],
    },
  },

})
