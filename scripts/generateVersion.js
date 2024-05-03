const fs = require('node:fs')
const path = require('node:path')
const version = require('../package.json').version

const fileContent = `export const version = \`${version}\`
`

fs.writeFileSync(path.join(__dirname, '../src/version.ts'), fileContent, 'utf-8')
