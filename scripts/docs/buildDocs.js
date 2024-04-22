/* eslint-disable no-console */
const { version } = require('../../package.json')
const { functionReference, categorizedFunctions } = require('../../cli/reference')
const examples = require('./examples')
const Lits = require('../../dist/index')
const path = require('path')
const fs = require('fs')

const DOC_DIR = path.resolve(__dirname, '../../docs')
const lits = new Lits.Lits({ debug: true })

setupPredictability()
setupDocDir()
copyScripts()
copyStyles()
copyFavicon()
writeIndexPage()

function writeIndexPage() {
  const page = `<!DOCTYPE html>
<html lang="en">
${getHtmlHeader()}
<body>
  <div id="wrapper">
    ${getTopBar({ back: false })}
    <main id="main-panel" class="fancy-scroll">
      ${getIndexPage()}
      ${getExamplePage()}
      ${Object.values(functionReference)
        .map(obj => getDocumentationContent(obj))
        .join('\n')}
    </main>
    ${getSideBar()}
    ${getPlayground()}
  </div>
  <script src="lits.iife.js"></script>
  <script src='examples.js'></script>
  <script src='scripts.js'></script>
</body>
</html>
`
  fs.writeFileSync(path.join(DOC_DIR, `index.html`), page, { encoding: 'utf-8' })
}

function getTopBar() {
  return `
<header id="top-bar">
  <div class="row">
    <div class="column search-container">
      <input placeholder="Search" autofocus id="search-input"/>
      <a onclick="clearSearch()" id="search-clear">Clear</a>
    </div>
    <div class="column header">Lits</div>
    <div class="column right version"><span>v${version}</span></div>
  </div>
</header>`
}

function getHtmlHeader() {
  return `
<head>
  <title>Lits</title>
  <link rel='shortcut icon' type='image/x-icon' href='favicon.ico' />
  <meta name="description" content="A reference and a playground for Lits - a Typescript Lisp implementation">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="styles.css">
</head>
`
}

function getPlayground() {
  return `
<div id="playground">
  <div id="resize-playground"></div>
  <div class="header row">
    <div class="column shrink">Playground</span></div>
    <div class="column right">
      <span class="button" onclick="run()">Run [F2]</span>
      <span class="button" onclick="analyze()">Analyze [F3]</span>
      <span class="button" onclick="tokenize(false)">Tokenize [F4]</span>
      <span class="button" onclick="tokenize(true)">Tokenize (debug) [F5]</span>
      <span class="button" onclick="parse(false)">Parse [F6]</span>
      <span class="button" onclick="parse(true)">Parse (debug) [F7]</span>
      <span class="button" onclick="resetPlayground()">Reset</span>
    </div>
  </div>
  <div id="panels-container">
    <div id="params-panel">
      <div class="column textarea-header">
        <label for="params-textarea">Params (JSON)</label>
        <a onclick="resetParams()">Clear</a>
      </div>
      <textarea id="params-textarea" class="fancy-scroll" spellcheck="false"></textarea>
    </div

    ><div id="resize-divider-1"></div

    ><div id="lits-panel">
      <div class="column textarea-header">
        <label for="lits-textarea">Lisp</label>
        <a onclick="resetLits()">Clear</a>
      </div>
      <textarea id="lits-textarea" class="fancy-scroll" spellcheck="false"></textarea>
    </div

    ><div id="resize-divider-2"></div

    ><div id="output-panel">
      <div class="column textarea-header">
        <label for="output-textarea">Result</label>
        <a onclick="resetOutput()">Clear</a>
      </div>
      <textarea id="output-textarea" class="fancy-scroll" readonly spellcheck="false" ></textarea>
    </div>
  </div>
</div>
`
}

function getIndexPage() {
  return `
<div id="index" class="content">
  <h1>Welcome to Lits!</h1>
  <br />
    <div class="text">
    <p>Lits is a Lisp dialect made to work well in a browser or Node environment. It's heavily inspired by Clojure, most of the core functions from Clojure have been ported.</p>
    <p>Some outstanding features / shortcommings worth mentioning.</p>
    <ul>
      <li>All datatypes in Lits are immutable.</li>
      <li>All functions are <a href="https://www.sitepoint.com/functional-programming-pure-functions/">pure</a>, unless the built-in function name ends with a !. See <pre>write!</pre> or <pre>rand!</pre> for example.</li>
      <li>All datatypes in Lits mapps directly to Javascript's types.</li>
      <li>No lazy evaluation.</li>
      <li>No quotes.</li>
      <li>No macros.</li>
      <li>No keyword symbols. <pre>:foo</pre> is just a shorthand for <pre>"foo"</pre>.</li>
      <li>Dynamic scoping, no lexical scoping</li>
    </ul>
    <p>You can see some examples and find documentation of all built-in function to the left.</p>
    <p>For more instruction on how to install and use Lits as a cli or a typescript lib, checkout <a href="https://github.com/YouCruit/lits">https://github.com/YouCruit/lits</a></p>
    <p>
    <p>Happy coding!</p>
  </div>
</div>
`
}

function getExamplePage() {
  return `
<div id="example-page" class="content">
  <h1>Examples</h1>
  <br />
  <ul>
  ${examples
    .map(example => {
      return `
      <li>
        <div class="row example-item">
          <div class="column wide">
            <div class="example-name">${example.name}</div>
            <div class="example-description">${example.description}</div>
          </div>
          <div class="column right">
            <span class="button" onclick="setPlayground('${example.id}')">Show in playground</span>
          </div>
        </div>
      </li>
    `
    })
    .join('\n')}
  </ul>
</div>
`
}

function getDocumentationContent(docObj) {
  const { name, description, returns, linkName, specialExpression, examples, arguments: args, clojureDocs } = docObj
  const clojureDocsLink =
    clojureDocs === null
      ? null
      : `https://clojuredocs.org/clojure.core/${clojureDocs !== undefined ? clojureDocs : name.replace('?', '_q')}`
  const formattedDescription = formatDescription(description)
  return `
<div id="${linkName}" class="content function">

  <div class="function-header row">
    <div class="column">${name}</div>
    ${
      clojureDocsLink
        ? `<div class="column right"><a target="_blank" class="link" href="${clojureDocsLink}">Clojure docs</a></div>`
        : ``
    }
  </div>

  ${specialExpression ? '<h3>Special Expression</h3>' : ''}
  <p>${formattedDescription}</p>
  <label>Syntax</label>
  <div class="indent">
    <pre>${getSyntax(name, args, returns)}</pre>
  </div>

  ${
    args.length === 0
      ? '<label>No arguments</label>'
      : `<label>Arguments</label><div class="indent">${args
          .map(arg => `<pre>${arg.name}: ${arg.type}</pre>`)
          .join('\n')}</div>`
  }

  <label>Examples</label>
  <div class="indent">
    ${examples
      .map(example => {
        var oldLog = console.log
        console.log = function () {}
        var oldWarn = console.warn
        console.warn = function () {}
        var result
        var escapedExample = escapeExample(example)
        try {
          result = lits.run(example)
          var stringifiedResult = stringifyValue(result)

          return `<pre><span class="example" onclick="addToPlayground('${escapedExample}')"> <span class="icon-button">▶</span> ${example} <span class="gray">=> ${stringifiedResult} </span> </span></pre>`
        } finally {
          console.log = oldLog
          console.warn = oldWarn
        }
      })
      .join('\n')}
  </div>
</div>
`
}

function getSideBar() {
  const categoryCollections = Object.values(functionReference).reduce((result, obj) => {
    result[obj.category] = result[obj.category] || []
    result[obj.category].push(obj)
    return result
  }, {})

  return `
<nav id="sidebar" class="fancy-scroll">
  <label class="link" onclick="showPage('index')">Home</label>
  <br />
  <label class="link" onclick="showPage('example-page')">Examples</label>
  <br />
  ${categorizedFunctions
    .map(categoryKey => {
      return `
        <label>${categoryKey}</label>
        <ul>
          ${
            categoryCollections[categoryKey]
              ? categoryCollections[categoryKey]
                  .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                  .map(obj => {
                    const linkName = obj.linkName
                    const name = escape(obj.name)
                    return `<li id="${linkName}_link" onclick="showPage('${linkName}')">${name}</li>`
                  })
                  .join('\n')
              : ''
          }
        </ul>`
    })
    .join('\n')}
</nav>
`
}

function setupDocDir() {
  fs.rmSync(DOC_DIR, { recursive: true, force: true })
  fs.mkdirSync(DOC_DIR)
}

function copyScripts() {
  fs.copyFileSync(path.join(__dirname, '../../dist/lits.iife.js'), path.join(DOC_DIR, 'lits.iife.js'))
  fs.copyFileSync(path.join(__dirname, `scripts.js`), path.join(DOC_DIR, `scripts.js`))
  const examplesContent = fs.readFileSync(path.join(__dirname, `examples.js`), { encoding: 'utf-8' })
  fs.writeFileSync(path.join(DOC_DIR, `examples.js`), examplesContent.replace('module.exports =', 'var examples ='))
}

function copyStyles() {
  fs.copyFileSync(path.join(__dirname, `styles.css`), path.join(DOC_DIR, `styles.css`))
}

function copyFavicon() {
  fs.copyFileSync(path.join(__dirname, `favicon.ico`), path.join(DOC_DIR, `favicon.ico`))
}

function stringifyValue(value) {
  if (Lits.isLitsFunction(value)) {
    if (value.builtin) {
      return `&lt;builtin function ${value.builtin}&gt;`
    } else {
      return `&lt;function ${value.name || 'λ'}&gt;`
    }
  }
  if (value === null) {
    return `null`
  }
  if (typeof value === 'object' && value instanceof Error) {
    return value.toString()
  }
  if (typeof value === 'object' && value instanceof RegExp) {
    return `${value}`
  }
  if (value === Number.POSITIVE_INFINITY) {
    return Number.POSITIVE_INFINITY
  }
  if (value === Number.NEGATIVE_INFINITY) {
    return Number.NEGATIVE_INFINITY
  }
  if (typeof value === 'number' && isNaN(value)) {
    return 'NaN'
  }
  return JSON.stringify(value)
}

function escape(str) {
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/</g, '&lt;')
  return str
}

function formatDescription(value) {
  value = value.replace(/`(.*?)`/g, '<span class="pre">$1</span>')
  value = value.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  value = value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  value = value.replace(/\*(.*?)\*/g, '<em>$1</em>')
  value = value.replace(/\n/g, '<br />')
  return value
}

function getSyntax(name, args, returns) {
  return `${name}${
    args.length ? ' ' + args.map(arg => `${arg.name}${arg.description ? `(${arg.description})` : ''}`).join(' ') : ''
  } => ${returns.type}`
}

function escapeExample(example) {
  return example.replace(/'/g, '___single_quote___').replace(/"/g, '___double_quote___')
}

function setupPredictability() {
  const randomNumbers = [
    0.724649596918931, 0.1388249643867875, 0.821295781502378, 0.642663245344025, 0.257336692966055, 0.1621162121010266,
    0.0512411106937297, 0.512940271243276, 0.1807933434445456, 0.869306144793219, 0.865493437679067, 0.4504678080912054,
    0.18831908049713, 0.0805542431392446, 0.761662190481596, 0.950144631380548, 0.866160133315509, 0.788226693776637,
    0.2229830914628106, 0.2004887977585411, 0.2774170450220144, 0.0425255820548612, 0.431408947560545,
    0.05749672486035419, 0.3163247795897952, 0.606916437286671, 0.041382990822423, 0.2873635546121706,
    0.4926377129231464, 0.303967271597769, 0.948285035929546, 0.865648333085831, 0.92505280038166, 0.535299158649211,
    0.790824947418548, 0.1538248006241795, 0.0106438257334767, 0.0890308979640907, 0.225883141584883, 0.919275930527486,
    0.219680179503865, 0.2665824680004086, 0.981218268743524, 0.562101157133258, 0.23931439850473, 0.68846222637459,
    0.1444092017324221, 0.791564983143653, 0.0519830520470812, 0.634199732451584, 0.255667754586123, 0.778884126897447,
    0.694950059539164, 0.00211632486282454, 0.914394389437389, 0.715825951783768, 0.265526899650267, 0.4562962145402027,
    0.1579910730259927, 0.662933825915595, 0.59822242668705, 0.02528028866287023, 0.01121441334537789, 0.75183972049943,
    0.2492908240601403, 0.511748225637472, 0.2099739291430991, 0.477220295002281, 0.04827697716906847,
    0.4754922796882463, 0.207674037199976, 0.0085000188304528, 0.061748501127621, 0.799883123026859, 0.66314381207545,
    0.0665130452298106, 0.265646797184853, 0.507777890869045, 0.2043436235145094, 0.937593527242748, 0.400310518313563,
    0.02974091720716275, 0.47880237804504, 0.102440772653596, 0.227084162198274, 0.0871596827341079, 0.435656677174363,
    0.907810006250739, 0.2180727287165035, 0.591560310442152, 0.867305526335541, 0.405180646504951, 0.9088849746197,
    0.832167818801142, 0.862615783104779, 0.904058166468492, 0.878662167344442, 0.3824415399376706, 0.00632051718922756,
    0.001103624059484897, 0.804612673745464, 0.143254818271045, 0.343696516361198, 0.614277202160512, 0.978328344754037,
    0.605435672625423, 0.1621180883617024, 0.2953693272151051, 0.858856379294906, 0.944880370466787, 0.887936143641048,
    0.263251078401791, 0.1852256402182875, 0.65921392929163, 0.634934526210938, 0.773975032358858, 0.74419619198916,
    0.563334961906775, 0.962728109334938, 0.821330198993253, 0.0789749380932397, 0.828478190526367, 0.0658476489945812,
    0.453833232630742, 0.661191183912482, 0.197257129924934, 0.571934314027094, 0.214526026628943, 0.344116447255011,
    0.908474464778653, 0.2553452062081616, 0.589897258972546, 0.1686691978376474, 0.0338053645753081, 0.151589070144055,
    0.398097657261722, 0.346038312486097, 0.1822282698612382, 0.724438636604875, 0.935863821998006, 0.971566630674129,
    0.83015458879268, 0.0686763587117812, 0.686178888402092, 0.576437933344064, 0.67834725686589, 0.60787447877307,
    0.74322393230408, 0.879819994827309, 0.245535582707424, 0.378131918445074, 0.451793693924884, 0.3084422795363026,
    0.800491875526588, 0.999097193682525, 0.2610157971483988, 0.335357672940188, 0.1052039825428155, 0.317619034137539,
    0.580406211986725, 0.67196334609823, 0.4507906722043195, 0.1344971571564744, 0.0958258208725702, 0.314601244044824,
    0.850367973654788, 0.052060545682686, 0.55637873634324, 0.781248010498152, 0.0621300672413029, 0.54836500721206,
    0.977765070071075, 0.0885142976763521, 0.543070715306584, 0.786041835260815, 0.25270162149154, 0.0908970743770914,
    0.362388861160324, 0.734936033147823, 0.1576375184348605, 0.538108999895079, 0.3073503844897498, 0.306558314229489,
    0.516056206343922, 0.541747161201498, 0.601458935235784, 0.561672793756173, 0.971003375127432, 0.916785562703722,
    0.90707125687722, 0.539109008159125, 0.250070614920158, 0.986040212042108, 0.974597208156972, 0.376720670775762,
    0.1076162976859377, 0.68680565540971, 0.2655368360878726, 0.0657567156834072, 0.3532738741308728, 0.999104596802,
    0.1011705076067297, 0.276588762344441, 0.274184812405826, 0.2708877245367268, 0.4621779534498058,
    0.2129112044002249, 0.823129348296905, 0.75432922156759, 0.22239108683421, 0.00266966708457243, 0.948853299455435,
    0.091266558611525, 0.221365669951392, 0.452046170448363, 0.0977422032629302, 0.0457822771772063, 0.116679996049757,
    0.1764954057610178, 0.450583148606643, 0.1236729744545257, 0.270571925176152, 0.0292311641646024, 0.430929818298506,
    0.741465667080691, 0.724815142059151, 0.140069232274165, 0.6282515129966, 0.240582929431122, 0.685858625074441,
    0.1021971333184235, 0.724707819215492, 0.54798254138684, 0.896867743217024, 0.3523092182462191, 0.887970804431847,
    0.946945474694055, 0.294979211932671, 0.327369319889698, 0.2920229357969752, 0.2282004087124636, 0.9860972622511,
    0.282402184748749, 0.99077372615291, 0.63781587022523, 0.4461226434412956, 0.535836861701568, 0.478904923674593,
    0.1249301456852049, 0.1548437236730042, 0.2750162717413675, 0.420497265195032, 0.78837060490384, 0.0978000108802715,
    0.4876198570835737, 0.258132237011706, 0.573769223998832, 0.671241780222558, 0.3636710639988301, 0.3678760565015163,
    0.369219568064374, 0.76070155818963, 0.256230009497742, 0.1670863670997732, 0.573495100120211, 0.919084857349896,
    0.2765149297000465, 0.829476118706452, 0.545583620443685, 0.4708711394878421, 0.944524630760783, 0.762673118635349,
  ]

  let i = 0
  Math.random = () => {
    const result = randomNumbers[i]
    i = (i + 1) % randomNumbers.length
    return result
  }

  Date.now = () => 1712145842007
}
