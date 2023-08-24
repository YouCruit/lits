const typescript = require('rollup-plugin-typescript')
const pkg = require('./package.json')

const input = 'src/index.ts'

const plugins = [
  typescript({
    typescript: require('typescript'),
  }),
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
    external: ['fs', 'path'],
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
]
