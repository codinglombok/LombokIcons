// Vector runner (GP-11): every case in vectors/lombokicons-vectors-v1.json against both builds.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import * as esm from '../dist/js/lombokicons.mjs'

const cjs = createRequire(import.meta.url)('../dist/js/lombokicons.cjs')
const doc = JSON.parse(readFileSync(new URL('../vectors/lombokicons-vectors-v1.json', import.meta.url), 'utf8'))

test('vector file has at least 100 cases', () => {
  assert.ok(doc.cases.length >= 100)
})

for (const c of doc.cases) {
  test(`${c.id} ${c.name} ${JSON.stringify(c.options ?? {})}`, () => {
    assert.equal(esm.renderIcon(c.name, c.options), c.expected, 'ESM')
    assert.equal(cjs.renderIcon(c.name, c.options), c.expected, 'CJS')
  })
}
