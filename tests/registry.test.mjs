// Icon registry checks (SPEC §2): names, categories, path syntax, geometry inside the view box.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const registry = JSON.parse(readFileSync(new URL('../src/icons.json', import.meta.url), 'utf8'))
const { icons, categories, meta } = registry

/**
 * Parses SVG path data (SVG 2 grammar, including compact arc flags such as "0 01-1 1") and
 * returns end and control points in absolute coordinates. Arcs contribute their end point
 * and the corners of the box around both end points grown by the radii.
 */
/** Samples an elliptical arc (SVG 2 appendix B.2.4, endpoint to centre conversion). */
function arcPoints(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
  if (rx === 0 || ry === 0 || (x1 === x2 && y1 === y2)) return [[x2, y2]]
  rx = Math.abs(rx)
  ry = Math.abs(ry)
  const cos = Math.cos(phi), sin = Math.sin(phi)
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
  if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda) }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
  const coef = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / den))
  const cxp = (coef * rx * y1p) / ry, cyp = (-coef * ry * x1p) / rx
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
  if (!fs && dt > 0) dt -= 2 * Math.PI
  if (fs && dt < 0) dt += 2 * Math.PI
  const out = []
  for (let k = 1; k <= 32; k++) {
    const t = t1 + (dt * k) / 32
    out.push([cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos])
  }
  return out
}

export function pathPoints(d) {
  let p = 0
  const ws = () => { while (p < d.length && /[\s,]/.test(d[p])) p++ }
  const num = () => {
    ws()
    const m = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(d.slice(p))
    if (!m) throw new Error(`expected number at ${p} in "${d}"`)
    p += m[0].length
    return Number(m[0])
  }
  const flag = () => {
    ws()
    const c = d[p++]
    if (c !== '0' && c !== '1') throw new Error(`expected arc flag at ${p - 1} in "${d}"`)
    return Number(c)
  }
  const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }
  const pts = []
  let cmd = ''
  let x = 0, y = 0, sx = 0, sy = 0
  ws()
  while (p < d.length) {
    if (/[A-Za-z]/.test(d[p])) cmd = d[p++]
    else if (!cmd || cmd.toUpperCase() === 'Z') throw new Error(`expected command at ${p} in "${d}"`)
    const up = cmd.toUpperCase()
    if (!(up in ARGS)) throw new Error(`unknown command ${cmd}`)
    const rel = cmd !== up
    const ax = v => (rel ? x + v : v)
    const ay = v => (rel ? y + v : v)
    switch (up) {
      case 'Z': x = sx; y = sy; break
      case 'M': x = ax(num()); y = ay(num()); sx = x; sy = y; pts.push([x, y]); cmd = rel ? 'l' : 'L'; break
      case 'L': case 'T': { const nx = ax(num()); const ny = ay(num()); x = nx; y = ny; pts.push([x, y]); break }
      case 'H': x = ax(num()); pts.push([x, y]); break
      case 'V': y = ay(num()); pts.push([x, y]); break
      case 'C': {
        const a = [num(), num(), num(), num(), num(), num()]
        pts.push([ax(a[0]), ay(a[1])], [ax(a[2]), ay(a[3])])
        x = ax(a[4]); y = ay(a[5]); pts.push([x, y]); break
      }
      case 'S': case 'Q': {
        const a = [num(), num(), num(), num()]
        pts.push([ax(a[0]), ay(a[1])])
        x = ax(a[2]); y = ay(a[3]); pts.push([x, y]); break
      }
      case 'A': {
        const rx0 = num(), ry0 = num(), phi = (num() * Math.PI) / 180
        const fa = flag(), fs = flag()
        const nx = ax(num()), ny = ay(num())
        pts.push(...arcPoints(x, y, rx0, ry0, phi, fa, fs, nx, ny))
        x = nx; y = ny; break
      }
    }
    ws()
  }
  return pts
}

test('meta describes a 24 x 24 stroke icon set', () => {
  assert.deepEqual(meta, { viewBox: '0 0 24 24', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
})

test('icon names are kebab-case and unique across categories', () => {
  const seen = new Set()
  for (const [cat, names] of Object.entries(categories)) {
    for (const n of names) {
      assert.match(n, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/)
      assert.ok(!seen.has(n), `${n} appears twice (${cat})`)
      assert.ok(icons[n], `${cat} lists unknown icon ${n}`)
      seen.add(n)
    }
  }
  assert.equal(seen.size, Object.keys(icons).length, 'every icon has exactly one category')
})

for (const [name, data] of Object.entries(icons)) {
  test(`${name}: paths parse and stay inside the 24 x 24 view box`, () => {
    assert.equal(Object.keys(data).sort().join(','), 'bold_accent,duo_accent,line')
    for (const key of ['line', 'bold_accent', 'duo_accent']) {
      const d = data[key]
      if (d === null) continue
      assert.match(d, /^[MmLlHhVvCcSsQqTtAaZz0-9 .,eE+-]+$/, `${key} uses only path characters`)
      for (const [px, py] of pathPoints(d)) {
        assert.ok(px >= -0.01 && px <= 24.01 && py >= -0.01 && py <= 24.01, `${key} point (${px}, ${py}) outside view box`)
      }
    }
  })
}
