// Splice the level sources (levels/*.js, levels/porto/**/*.js) into index.html.
//   node tools/build.mjs                     rewrite index.html in place
//   node tools/build.mjs --out /path/x.html  write a separate copy (index.html untouched), for testing
//   node tools/build.mjs --check             only check that the result parses
//   --only uni,east   splice only these Porto districts (the others are left out: flat base ground)
// With --out, a district file that doesn't parse on its own is left out with a warning, so one
// agent's half-written file doesn't break everyone else's test page. Rewriting index.html is strict.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const OUT = opt('--out'), CHECK = args.includes('--check'), ONLY = opt('--only') ? opt('--only').split(',') : null;
const START = '/* ---------------- a kit for building cities', END = '/* ---------------- the chosen level ---------------- */';
const LEVELS = ['kit.js', 'dt.js'];
const walk = d => readdirSync(d).sort().flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : []; });
// porto: the base first, then each district's files (index.js last in its folder)
const portoDir = join(ROOT, 'levels', 'porto');
const porto = [join(portoDir, 'base.js'), ...readdirSync(portoDir).sort().filter(f => statSync(join(portoDir, f)).isDirectory() && (!ONLY || ONLY.includes(f)))
  .flatMap(d => walk(join(portoDir, d)).sort((a, b) => (a.endsWith('/index.js') - b.endsWith('/index.js')) || a.localeCompare(b)))];
let files = [...LEVELS.map(f => join(ROOT, 'levels', f)), ...porto];
if (OUT) files = files.filter(f => { if (!f.startsWith(portoDir + '/') || f.endsWith('/base.js')) return true; try { new Function(readFileSync(f, 'utf8')); return true; } catch (e) { console.warn(`build: left out ${f.replace(ROOT + '/', '')}: ${e.message}`); return false; } });
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const a = html.indexOf(START), b = html.indexOf(END);
if (a < 0 || b < 0 || b < a) { console.error('build: splice markers not found in index.html'); process.exit(1); }
// top-level names must be unique across all the files (the page is one module: a repeat is fatal there)
{ const seen = new Map(), dups = [], RE = /^(?:function\s*\*?\s*|(?:const|let|var|class)\s+)([A-Za-z_$][\w$]*)/gm;
  for (const m of (html.slice(0, a) + html.slice(b)).matchAll(RE)) seen.set(m[1], 'index.html');
  for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(RE)) {
    const n = m[1], rel = f.replace(ROOT + '/', ''); if (seen.has(n) && seen.get(n) !== rel) dups.push(`${n} (${seen.get(n)} and ${rel})`); else seen.set(n, rel); }
  if (dups.length) { console.error('build: names defined twice at the top level: ' + dups.join(', ')); process.exit(1); } }
const body = files.map(f => readFileSync(f, 'utf8').replace(/\s+$/, '') + '\n').join('\n') + '\n';
const out = html.slice(0, a) + body + html.slice(b);
// a quick syntax check of the game script (the module that holds the levels)
const m = out.match(/<script type="module">([\s\S]*?)<\/script>/);
if (m) {
  try { new Function(m[1].replace(/^\s*import[^;]+;/gm, '')); }
  catch (e) {
    // find which source file the error is in by checking each on its own
    let where = '';
    for (const f of files) { try { new Function(readFileSync(f, 'utf8')); } catch (e2) { where += `\n  ${f.replace(ROOT + '/', '')}: ${e2.message}`; } }
    console.error('build: the game script does not parse: ' + e.message + where); process.exit(1);
  }
}
if (CHECK) { console.log(`build: ok (${files.length} level files)`); process.exit(0); }
writeFileSync(OUT || join(ROOT, 'index.html'), out);
console.log(`build: ${OUT || 'index.html'} (${files.length} level files, ${(out.length / 1024).toFixed(0)} KB)`);
