const typescript = require('@rollup/plugin-typescript')
const jsonPlugin = require('@rollup/plugin-json')
const pkg = require('./package.json')

const input = 'src/index.ts'

const plugins = [
  typescript({
    tsconfig: 'tsconfig.json',
  }),
  jsonPlugin(),
]

module.exports = [
  {
    input,
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.iife,
        format: 'iife',
        sourcemap: true,
        name: 'Lits',
      },
    ],
    plugins,
  },
  {
    input: 'src/testFramework/index.ts',
    external: ['node:fs', 'node:path'],
    output: [
      {
        file: 'dist/testFramework.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/testFramework.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input: 'reference/index.ts',
    output: [
      {
        file: 'dist/reference.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input: 'playgroundBuilder/src/buildPlaygroundSite.ts',
    external: ['node:fs', 'node:path'],
    output: [
      {
        file: 'build/buildPlaygroundSite.js',
        format: 'cjs',
      },
    ],
    plugins,
  },
  {
    onwarn(warning, warn) {
      // suppress eval warnings
      if (warning.code === 'EVAL')
        return

      warn(warning)
    },
    input: 'playground/src/playground.ts',
    output: [
      {
        file: 'build/www/playground.js',
        format: 'iife',
        name: 'Playground',
      },
    ],
    plugins,
  },
]
