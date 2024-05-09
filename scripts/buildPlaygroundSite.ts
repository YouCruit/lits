import path from 'node:path'
import fs from 'node:fs'
import { getFunctionDocumentations } from './components/functionDocumentation'
import { getSearchDialog } from './components/searchDialog/searchDialog'
import { randomNumbers } from './utils/utils'
import { getStartPage } from './components/startPage'
import { getExamplePage } from './components/examplePage'
import { getPlayground } from './components/playground'
import { getSideBar } from './components/sideBar'
import { allSearchResultEntries } from './allSearchResultEntries'

const DOC_DIR = path.resolve(__dirname, '../docs')
setupPredictability()
setupDocDir()
copyLitsScript()
copyAssets()
writeIndexPage()

function writeIndexPage() {
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Lits</title>
  <link rel='shortcut icon' type='image/x-icon' href='favicon.ico' />
  <meta name="description" content="A reference and a playground for Lits - a Typescript Lisp implementation">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="styles.css">
</script>

</head>
<body>
  <div id="wrapper">
    <main id="main-panel" class="fancy-scroll">
      ${getStartPage()}
      ${getExamplePage()}
      ${getFunctionDocumentations()}
    </main>
    ${getSideBar()}
    ${getPlayground()}
  </div>
  ${getSearchDialog()}

  <script src="lits.iife.js"></script>

  <script>
    window.Playground = {}
    window.Playground.allSearchResultEntries = JSON.parse(atob('${btoa(JSON.stringify(allSearchResultEntries))}'))
  </script>

  <script src='scripts.js'></script>
  <script src='Search.js'></script>
</body>
</html>
`
  fs.writeFileSync(path.join(DOC_DIR, 'index.html'), page, { encoding: 'utf-8' })
}

function setupDocDir() {
  fs.rmSync(DOC_DIR, { recursive: true, force: true })
  fs.mkdirSync(DOC_DIR)
}

function copyLitsScript() {
  fs.copyFileSync(path.join(__dirname, '../dist/lits.iife.js'), path.join(DOC_DIR, 'lits.iife.js'))
}

function copyAssets() {
  fs.cpSync(path.join(__dirname, '../playgroundAssets/'), path.join(DOC_DIR), { recursive: true })
}

function setupPredictability() {
  let i = 0
  Math.random = () => {
    const result = randomNumbers[i]!
    i = (i + 1) % randomNumbers.length
    return result
  }

  Date.now = () => 1712145842007
}
