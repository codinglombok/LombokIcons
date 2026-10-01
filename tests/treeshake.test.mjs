// Bundling a single icon must not pull in the other icons (claim in README).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

test('importing one icon and renderIconData keeps the bundle small', async () => {
  const entry = fileURLToPath(new URL('../dist/js/lombokicons.mjs', import.meta.url))
  const result = await build({
    stdin: { contents: `import { lfHome, renderIconData } from ${JSON.stringify(entry)}; console.log(renderIconData(lfHome))`, resolveDir: '.' },
    bundle: true,
    write: false,
    minify: true,
    format: 'esm',
  })
  const code = result.outputFiles[0].text
  assert.ok(code.includes('M3 10.5L12 3'), 'home path kept')
  assert.ok(!code.includes("name:\"search\""), 'other icons removed')
  assert.ok(code.length < 4000, `bundle ${code.length} bytes`)
})
