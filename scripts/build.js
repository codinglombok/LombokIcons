#!/usr/bin/env node
/**
 * LombokIcons Build Script
 * Generates: individual SVGs, SVG sprite, JS module, CSS dist
 * Copyright (c) 2026 codinglombok — Apache-2.0
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;

// ─── Load icon registry ──────────────────────────────────────
const registry = JSON.parse(fs.readFileSync(path.join(SRC, 'icons.json'), 'utf8'));
const { meta, icons, categories } = registry;

// ─── Validate registry (SPEC §2) ─────────────────────────────
const RE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const RE_PATH = /^[MmLlHhVvCcSsQqTtAaZz0-9 .,eE+-]+$/;
function validateRegistry() {
  const errors = [];
  const seen = new Map();
  for (const [cat, names] of Object.entries(categories)) {
    for (const n of names) {
      if (seen.has(n)) errors.push(`${n} listed in ${seen.get(n)} and ${cat}`);
      seen.set(n, cat);
      if (!icons[n]) errors.push(`category ${cat} lists unknown icon ${n}`);
    }
  }
  for (const [name, data] of Object.entries(icons)) {
    if (!RE_NAME.test(name)) errors.push(`invalid icon name ${name}`);
    if (!seen.has(name)) errors.push(`${name} has no category`);
    if (typeof data.line !== 'string' || !RE_PATH.test(data.line)) errors.push(`${name}: invalid line path`);
    for (const k of ['bold_accent', 'duo_accent']) {
      if (data[k] !== null && (typeof data[k] !== 'string' || !RE_PATH.test(data[k]))) errors.push(`${name}: invalid ${k}`);
    }
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
}

// ─── Helpers ─────────────────────────────────────────────────
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function svgWrap(inner, cls) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${meta.viewBox}" fill="${meta.fill}" stroke="currentColor" stroke-width="${meta.strokeWidth}" stroke-linecap="${meta.strokeLinecap}" stroke-linejoin="${meta.strokeLinejoin}"${cls ? ` class="${cls}"` : ''}>${inner}</svg>`;
}

function pathsToSvgContent(d, multipath) {
  // d can contain multiple M commands — split into individual paths
  // For simple single-path, just wrap in <path>
  if (!d) return '';
  return `<path d="${d}"/>`;
}

// ─── Generate individual SVGs ────────────────────────────────
function buildIndividualSVGs() {
  const modes = ['line', 'bold', 'duo'];
  
  for (const mode of modes) {
    const dir = path.join(DIST, 'svg', mode);
    ensureDir(dir);
  }

  for (const [name, data] of Object.entries(icons)) {
    // LINE mode
    const lineSvg = svgWrap(pathsToSvgContent(data.line));
    fs.writeFileSync(path.join(DIST, 'svg', 'line', `${name}.svg`), lineSvg);

    // BOLD mode
    let boldInner = pathsToSvgContent(data.line);
    if (data.bold_accent) {
      boldInner += `<path d="${data.bold_accent}" class="lf-bold-fill" fill="currentColor" stroke="none"/>`;
    }
    const boldSvg = svgWrap(boldInner);
    fs.writeFileSync(path.join(DIST, 'svg', 'bold', `${name}.svg`), boldSvg);

    // DUO mode
    let duoInner = '';
    if (data.duo_accent) {
      duoInner += `<path d="${data.duo_accent}" class="lf-accent" fill="currentColor" opacity="0.32" stroke="none"/>`;
    }
    duoInner += pathsToSvgContent(data.line);
    const duoSvg = svgWrap(duoInner);
    fs.writeFileSync(path.join(DIST, 'svg', 'duo', `${name}.svg`), duoSvg);
  }

  console.log(`  ok ${Object.keys(icons).length * 3} individual SVGs`);
}

// ─── Generate SVG sprite ─────────────────────────────────────
function buildSprite() {
  ensureDir(path.join(DIST, 'svg'));
  
  const modes = ['line', 'bold', 'duo'];
  
  for (const mode of modes) {
    let symbols = '';
    
    for (const [name, data] of Object.entries(icons)) {
      let inner = '';
      
      if (mode === 'duo' && data.duo_accent) {
        inner += `<path d="${data.duo_accent}" class="lf-accent" fill="currentColor" opacity="0.32" stroke="none"/>`;
      }
      
      inner += pathsToSvgContent(data.line);
      
      if (mode === 'bold' && data.bold_accent) {
        inner += `<path d="${data.bold_accent}" class="lf-bold-fill" fill="currentColor" stroke="none"/>`;
      }
      
      symbols += `<symbol id="lf-${name}" viewBox="${meta.viewBox}">${inner}</symbol>\n`;
    }
    
    const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}</svg>`;
    fs.writeFileSync(path.join(DIST, 'svg', `lombokicons-${mode}.svg`), sprite);
  }

  console.log(`  ok 3 SVG sprites (line/bold/duo)`);
}

// ─── Generate JS modules + types ─────────────────────────────
function camel(name) {
  return 'lf' + name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

function iconLiteral(name, data) {
  const q = v => (v ? `'${v}'` : 'null');
  return `{ name: '${name}', line: '${data.line}', bold_accent: ${q(data.bold_accent)}, duo_accent: ${q(data.duo_accent)} }`;
}

function buildJSModule() {
  ensureDir(path.join(DIST, 'js'));
  const runtime = fs.readFileSync(path.join(SRC, 'js', 'runtime.js'), 'utf8');
  const names = Object.keys(icons);
  const header = `// LombokIcons v${VERSION}\n// Apache-2.0 — codinglombok\n`;

  // ESM: every icon is a standalone constant so bundlers can drop unused ones.
  let esm = header + '\n';
  for (const name of names) esm += `export const ${camel(name)} = /*#__PURE__*/ Object.freeze(${iconLiteral(name, icons[name])});\n`;
  esm += `\nexport const icons = /*#__PURE__*/ Object.freeze({\n${names.map(n => `  '${n}': ${camel(n)},`).join('\n')}\n});\n`;
  esm += `export const categoryMap = /*#__PURE__*/ Object.freeze(${JSON.stringify(categories)});\n`;
  esm += `export const count = ${names.length};\nexport const version = '${VERSION}';\n\n`;
  esm += runtime;
  esm += `\nexport { escapeAttr, isValidSize, isValidColor, renderIconData, renderIcon, replaceIcons };\n`;
  fs.writeFileSync(path.join(DIST, 'js', 'lombokicons.mjs'), esm);

  // CJS: same API.
  let cjs = header + "'use strict';\n\n";
  for (const name of names) cjs += `const ${camel(name)} = Object.freeze(${iconLiteral(name, icons[name])});\n`;
  cjs += `\nconst icons = Object.freeze({\n${names.map(n => `  '${n}': ${camel(n)},`).join('\n')}\n});\n`;
  cjs += `const categoryMap = Object.freeze(${JSON.stringify(categories)});\n`;
  cjs += `const count = ${names.length};\nconst version = '${VERSION}';\n\n`;
  cjs += runtime;
  cjs += `\nmodule.exports = {\n  icons, categoryMap, count, version,\n  escapeAttr, isValidSize, isValidColor, renderIconData, renderIcon, replaceIcons,\n${names.map(n => `  ${camel(n)},`).join('\n')}\n};\n`;
  fs.writeFileSync(path.join(DIST, 'js', 'lombokicons.cjs'), cjs);

  // Types
  let dts = fs.readFileSync(path.join(SRC, 'js', 'lombokicons.d.ts'), 'utf8');
  dts += '\n' + names.map(n => `export declare const ${camel(n)}: IconData`).join('\n') + '\n';
  fs.writeFileSync(path.join(DIST, 'js', 'lombokicons.d.mts'), dts);
  fs.writeFileSync(path.join(DIST, 'js', 'lombokicons.d.cts'), dts);

  console.log(`  ok JS modules (ESM + CJS) and type declarations`);
}

// ─── Copy & minify CSS ───────────────────────────────────────
function buildCSS() {
  ensureDir(path.join(DIST, 'css'));
  
  const css = fs.readFileSync(path.join(SRC, 'css', 'lombokicons.css'), 'utf8');
  fs.writeFileSync(path.join(DIST, 'css', 'lombokicons.css'), css);
  
  // Simple minification (strip comments, extra whitespace)
  const min = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    .trim();
  
  fs.writeFileSync(path.join(DIST, 'css', 'lombokicons.min.css'), min);
  
  console.log(`  ok CSS (${(css.length / 1024).toFixed(1)}KB → ${(min.length / 1024).toFixed(1)}KB min)`);
}

// ─── Generate icon catalog ───────────────────────────────────
function buildCatalog() {
  const catalog = {
    version: VERSION,
    total: Object.keys(icons).length,
    categories: {},
    icons: []
  };
  
  for (const [cat, names] of Object.entries(categories)) {
    catalog.categories[cat] = names.length;
  }
  
  for (const [name, data] of Object.entries(icons)) {
    const cat = Object.entries(categories).find(([, names]) => names.includes(name));
    catalog.icons.push({
      name,
      category: cat ? cat[0] : 'uncategorized',
      hasBoldAccent: !!data.bold_accent,
      hasDuoAccent: !!data.duo_accent
    });
  }
  
  fs.writeFileSync(path.join(DIST, 'catalog.json'), JSON.stringify(catalog, null, 2));
  console.log(`  ok catalog.json`);
}

// ─── Main ────────────────────────────────────────────────────
console.log('LombokIcons Build\n');

validateRegistry();
ensureDir(DIST);
buildIndividualSVGs();
buildSprite();
buildJSModule();
buildCSS();
buildCatalog();

console.log(`\nDone — ${Object.keys(icons).length} icons × 3 modes = ${Object.keys(icons).length * 3} variants`);
