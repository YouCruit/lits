import { styles } from '../styles'

export function getStartPage(): string {
  return `
  <div id="index" class="content">
    <center>
    <span ${styles('whitespace-pre', 'font-mono', 'text-xl')}>
    ░▒▓█▓▒░      ░▒▓█▓▒░▒▓████████▓▒░▒▓███████▓▒░ 
    ░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░  ░▒▓█▓▒░        
    ░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░  ░▒▓█▓▒░        
    ░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓██████▓▒░  
    ░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░         ░▒▓█▓▒░ 
    ░▒▓█▓▒░      ░▒▓█▓▒░  ░▒▓█▓▒░         ░▒▓█▓▒░ 
    ░▒▓████████▓▒░▒▓█▓▒░  ░▒▓█▓▒░  ░▒▓███████▓▒░  
    </span>
  </center>
                                                  
    <br />
    <div>
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
