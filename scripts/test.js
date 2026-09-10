#!/usr/bin/env node
/**
 * LombokIcons Test — verifies build output integrity
 */

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
let pass = 0;
let fail = 0;

function assert(cond, msg) {
  if (cond) { pass++; console.log(`  ✓ ${msg}`); }
  else      { fail++; console.log(`  ✗ ${msg}`); }
}

console.log('🧪 LombokIcons Tests\n');

// ── File existence ──
const catalog = JSON.parse(fs.readFileSync(path.join(DIST, 'catalog.json'), 'utf8'));
assert(catalog.total > 0, `catalog has ${catalog.total} icons`);

for (const icon of catalog.icons) {
  for (const mode of ['line', 'bold', 'duo']) {
    const p = path.join(DIST, 'svg', mode, `${icon.name}.svg`);
    assert(fs.existsSync(p), `${mode}/${icon.name}.svg exists`);
  }
}

// ── Sprites ──
for (const mode of ['line', 'bold', 'duo']) {
  const p = path.join(DIST, 'svg', `lombokicons-${mode}.svg`);
  assert(fs.existsSync(p), `sprite lombokicons-${mode}.svg exists`);
  const content = fs.readFileSync(p, 'utf8');
  assert(content.includes('<symbol'), `sprite ${mode} contains <symbol> elements`);
}

// ── CSS ──
const css = fs.readFileSync(path.join(DIST, 'css', 'lombokicons.css'), 'utf8');
assert(css.includes('--lf-size'), 'CSS contains --lf-size variable');
assert(css.includes('.lf-spin'), 'CSS contains .lf-spin animation');
assert(css.includes('prefers-reduced-motion'), 'CSS respects reduced motion');

const minCss = fs.readFileSync(path.join(DIST, 'css', 'lombokicons.min.css'), 'utf8');
assert(minCss.length < css.length, `minified CSS is smaller (${minCss.length} < ${css.length})`);

// ── JS ──
const esm = fs.readFileSync(path.join(DIST, 'js', 'lombokicons.mjs'), 'utf8');
assert(esm.includes('export function renderIcon'), 'ESM exports renderIcon');
assert(esm.includes('export function replaceIcons'), 'ESM exports replaceIcons');
assert(esm.includes('export const icons'), 'ESM exports icons object');

const cjs = fs.readFileSync(path.join(DIST, 'js', 'lombokicons.cjs'), 'utf8');
assert(cjs.includes('module.exports'), 'CJS has module.exports');

// ── SVG validity ──
const sampleSvg = fs.readFileSync(path.join(DIST, 'svg', 'line', 'home.svg'), 'utf8');
assert(sampleSvg.startsWith('<svg'), 'SVG starts with <svg tag');
assert(sampleSvg.includes('viewBox="0 0 24 24"'), 'SVG has correct viewBox');
assert(sampleSvg.includes('stroke-linecap="round"'), 'SVG has round linecap');

// ── Duo mode has accent paths ──
const duoHome = fs.readFileSync(path.join(DIST, 'svg', 'duo', 'home.svg'), 'utf8');
assert(duoHome.includes('lf-accent'), 'duo/home.svg has lf-accent class');

console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
