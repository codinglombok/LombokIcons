// Public API behaviour of the generated modules (SPEC §3-§4).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import * as esm from '../dist/js/lombokicons.mjs'

const cjs = createRequire(import.meta.url)('../dist/js/lombokicons.cjs')
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('ESM and CJS expose the same names and values', () => {
  const names = Object.keys(esm).sort()
  assert.deepEqual(Object.keys(cjs).sort(), names)
  for (const n of names) {
    if (typeof esm[n] === 'function') assert.equal(typeof cjs[n], 'function', n)
    else assert.deepEqual(cjs[n], esm[n], n)
  }
})

test('version, count and category map', () => {
  assert.equal(esm.version, pkg.version)
  assert.equal(esm.count, Object.keys(esm.icons).length)
  assert.equal(esm.count, 69)
  const listed = Object.values(esm.categoryMap).flat()
  assert.equal(listed.length, esm.count)
  assert.deepEqual([...listed].sort(), Object.keys(esm.icons).sort())
})

test('icon constants are frozen and match the registry entries', () => {
  assert.equal(esm.icons.home, esm.lfHome)
  assert.equal(esm.icons['arrow-up'], esm.lfArrowUp)
  assert.ok(Object.isFrozen(esm.lfHome))
  assert.ok(Object.isFrozen(esm.icons))
  assert.throws(() => { 'use strict'; esm.icons.home = null })
})

test('renderIconData renders a single imported icon', () => {
  assert.equal(esm.renderIconData(esm.lfHome, { mode: 'duo' }), esm.renderIcon('home', { mode: 'duo' }))
  assert.equal(esm.renderIconData(null), '')
  assert.equal(esm.renderIconData({ line: 5 }), '')
})

test('validators', () => {
  for (const ok of ['1px', '1.5em', '2rem', '50%', '0', '3vw']) assert.ok(esm.isValidSize(ok), ok)
  for (const bad of ['1', 'px', '-2px', '1e3px', '2rem;x', ' 2rem', 2]) assert.ok(!esm.isValidSize(bad), String(bad))
  for (const ok of ['#fff', '#ffffffaa', 'red', 'rgb(1, 2, 3)', 'var(--x)', 'oklch(0.5 0.1 120 / 50%)']) assert.ok(esm.isValidColor(ok), ok)
  for (const bad of ['#ff', 'url(x)', 'red;', 'var(x)', 'rgb(1,2,3);x', 3]) assert.ok(!esm.isValidColor(bad), String(bad))
  assert.equal(esm.escapeAttr(`<a href="x">'&'`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;')
})

test('replaceIcons swaps [data-lf] elements and keeps class and accessible name', () => {
  const replaced = []
  const makeTarget = attrs => ({
    getAttribute: k => (k in attrs ? attrs[k] : null),
    replaceWith: el => replaced.push(el),
  })
  const targets = [
    makeTarget({ 'data-lf': 'bell', 'data-lf-mode': 'bold', class: 'lf-lg" onclick="x' }),
    makeTarget({ 'data-lf': 'home', 'aria-label': 'Beranda' }),
    makeTarget({ 'data-lf': 'unknown' }),
  ]
  const created = []
  globalThis.document = {
    body: { querySelectorAll: () => targets },
    createElement: () => {
      const el = { set innerHTML(v) { this.firstChild = v } }
      created.push(el)
      return el
    },
  }
  try {
    esm.replaceIcons(null, 'duo')
  } finally {
    delete globalThis.document
  }
  assert.equal(replaced.length, 2, 'unknown icons are left in place')
  assert.equal(replaced[0], esm.renderIcon('bell', { mode: 'bold', class: 'lf-lg" onclick="x' }))
  assert.ok(replaced[0].includes('class="lf lf-lg&quot; onclick=&quot;x"'))
  assert.equal(replaced[1], esm.renderIcon('home', { mode: 'duo', title: 'Beranda' }))
})
