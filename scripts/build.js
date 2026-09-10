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

// ─── Load icon registry ──────────────────────────────────────
const registry = JSON.parse(fs.readFileSync(path.join(SRC, 'icons.json'), 'utf8'));
const { meta, icons, categories } = registry;

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

  console.log(`  ✓ ${Object.keys(icons).length * 3} individual SVGs`);
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

  console.log(`  ✓ 3 SVG sprites (line/bold/duo)`);
}

// ─── Generate JS module ──────────────────────────────────────
function buildJSModule() {
  ensureDir(path.join(DIST, 'js'));
  
  // ESM
  let esm = `// LombokIcons v0.1.0 — ESM\n// Apache-2.0 — codinglombok\n\n`;
  
  // Icon data export
  esm += `export const icons = {};\n\n`;
  
  for (const [name, data] of Object.entries(icons)) {
    const camelName = 'lf' + name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
    
    esm += `export const ${camelName} = {\n`;
    esm += `  name: '${name}',\n`;
    esm += `  line: '${data.line}',\n`;
    esm += `  bold_accent: ${data.bold_accent ? `'${data.bold_accent}'` : 'null'},\n`;
    esm += `  duo_accent: ${data.duo_accent ? `'${data.duo_accent}'` : 'null'},\n`;
    esm += `};\nicons['${name}'] = ${camelName};\n\n`;
  }
  
  // Render function
  esm += `/**
 * Render an icon as an SVG string.
 * @param {string} name — Icon name (e.g. 'home', 'arrow-up')
 * @param {Object} opts
 * @param {'line'|'bold'|'duo'} opts.mode — Rendering mode (default: 'line')
 * @param {string} opts.size — CSS size (default: '1.25em')
 * @param {string} opts.class — Extra CSS classes
 * @param {string} opts.color — Override color
 * @returns {string} SVG markup
 */
export function renderIcon(name, opts = {}) {
  const icon = icons[name];
  if (!icon) return '';
  
  const mode = opts.mode || 'line';
  const size = opts.size || '1.25em';
  const cls = opts.class || '';
  const color = opts.color ? \` style="--lf-color:\${opts.color}"\` : '';
  
  let inner = '';
  
  if (mode === 'duo' && icon.duo_accent) {
    inner += \`<path d="\${icon.duo_accent}" class="lf-accent" fill="currentColor" opacity="0.32" stroke="none"/>\`;
  }
  
  inner += \`<path d="\${icon.line}"/>\`;
  
  if (mode === 'bold' && icon.bold_accent) {
    inner += \`<path d="\${icon.bold_accent}" class="lf-bold-fill" fill="currentColor" stroke="none"/>\`;
  }
  
  return \`<span class="lf \${cls}"\${color}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\${inner}</svg></span>\`;
}

/**
 * Replace all <i data-lf="name"> elements with rendered SVG icons.
 * @param {Element} root — Container to scan (default: document.body)
 * @param {'line'|'bold'|'duo'} mode — Default rendering mode
 */
export function replaceIcons(root, mode = 'line') {
  const el = root || document.body;
  const targets = el.querySelectorAll('[data-lf]');
  
  targets.forEach(target => {
    const name = target.getAttribute('data-lf');
    const iconMode = target.getAttribute('data-lf-mode') || mode;
    const cls = target.className || '';
    const html = renderIcon(name, { mode: iconMode, class: cls });
    
    if (html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const newEl = temp.firstChild;
      target.replaceWith(newEl);
    }
  });
}

export const version = '0.1.0';
export const count = ${Object.keys(icons).length};
export const categoryMap = ${JSON.stringify(categories, null, 2)};
`;

  fs.writeFileSync(path.join(DIST, 'js', 'lombokicons.mjs'), esm);
  
  // CJS
  let cjs = `// LombokIcons v0.1.0 — CJS\n// Apache-2.0 — codinglombok\n'use strict';\n\n`;
  cjs += `const icons = {};\n\n`;
  
  for (const [name, data] of Object.entries(icons)) {
    const camelName = 'lf' + name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
    cjs += `const ${camelName} = { name: '${name}', line: '${data.line}', bold_accent: ${data.bold_accent ? `'${data.bold_accent}'` : 'null'}, duo_accent: ${data.duo_accent ? `'${data.duo_accent}'` : 'null'} };\nicons['${name}'] = ${camelName};\n`;
  }
  
  cjs += `\nmodule.exports = { icons, version: '0.1.0', count: ${Object.keys(icons).length} };\n`;
  
  fs.writeFileSync(path.join(DIST, 'js', 'lombokicons.cjs'), cjs);
  
  console.log(`  ✓ JS modules (ESM + CJS)`);
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
  
  console.log(`  ✓ CSS (${(css.length / 1024).toFixed(1)}KB → ${(min.length / 1024).toFixed(1)}KB min)`);
}

// ─── Generate icon catalog ───────────────────────────────────
function buildCatalog() {
  const catalog = {
    version: '0.1.0',
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
  console.log(`  ✓ catalog.json`);
}

// ─── Main ────────────────────────────────────────────────────
console.log('🔧 LombokIcons Build\n');

ensureDir(DIST);
buildIndividualSVGs();
buildSprite();
buildJSModule();
buildCSS();
buildCatalog();

console.log(`\n✅ Done — ${Object.keys(icons).length} icons × 3 modes = ${Object.keys(icons).length * 3} variants`);
