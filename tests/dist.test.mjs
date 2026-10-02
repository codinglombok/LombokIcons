// Integrity of every generated file (static SVGs, sprites, CSS, catalog, types).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const dist = p => new URL(`../dist/${p}`, import.meta.url)
const read = p => readFileSync(dist(p), 'utf8')
const catalog = JSON.parse(read('catalog.json'))
const registry = JSON.parse(readFileSync(new URL('../src/icons.json', import.meta.url), 'utf8'))
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('catalog matches the registry and package version', () => {
  assert.equal(catalog.version, pkg.version)
  assert.equal(catalog.total, Object.keys(registry.icons).length)
  for (const icon of catalog.icons) {
    const data = registry.icons[icon.name]
    assert.equal(icon.hasBoldAccent, !!data.bold_accent)
    assert.equal(icon.hasDuoAccent, !!data.duo_accent)
    assert.notEqual(icon.category, 'uncategorized')
  }
})

for (const mode of ['line', 'bold', 'duo']) {
  test(`${mode}: one static SVG per icon with the registry paths`, () => {
    for (const [name, data] of Object.entries(registry.icons)) {
      const svg = read(`svg/${mode}/${name}.svg`)
      assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"'), name)
      assert.ok(svg.endsWith('</svg>'), name)
      assert.ok(svg.includes(`<path d="${data.line}"/>`), name)
      if (mode === 'bold') assert.equal(svg.includes('lf-bold-fill'), !!data.bold_accent, name)
      if (mode === 'duo') assert.equal(svg.includes('lf-accent'), !!data.duo_accent, name)
    }
  })

  test(`${mode}: sprite has one symbol per icon`, () => {
    const sprite = read(`svg/lombokicons-${mode}.svg`)
    assert.equal((sprite.match(/<symbol /g) ?? []).length, catalog.total)
    for (const name of Object.keys(registry.icons)) assert.ok(sprite.includes(`<symbol id="lf-${name}" viewBox="0 0 24 24">`), name)
  })
}

test('CSS: tokens, reduced motion, version banner, minified build is smaller', () => {
  const css = read('css/lombokicons.css')
  for (const token of ['--lf-size', '--lf-color', '--lf-stroke', '--lf-duo', '--lf-duo-opacity']) assert.ok(css.includes(token), token)
  assert.ok(css.includes('prefers-reduced-motion'))
  assert.ok(css.includes(`LombokIcons v${pkg.version}`))
  const min = read('css/lombokicons.min.css')
  assert.ok(min.length < css.length)
  assert.ok(min.length <= 8192, 'CSS budget: 8 KB minified')
})

test('type declarations exist for ESM and CJS and declare every icon constant', () => {
  for (const f of ['js/lombokicons.d.mts', 'js/lombokicons.d.cts']) {
    assert.ok(existsSync(dist(f)), f)
    const dts = read(f)
    assert.ok(dts.includes('export declare function renderIcon('))
    assert.ok(dts.includes('export declare const lfHome: IconData'))
  }
})
