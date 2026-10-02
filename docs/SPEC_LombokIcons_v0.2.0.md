# LombokIcons — SPEC v0.2.0

This document is the normative cross-language contract. Every language port MUST produce byte-identical output for all specified inputs. Deviations from this specification are bugs.

| Atribut | Nilai |
|---|---|
| Versi SPEC | 0.2.0 (berlaku untuk paket `lombokicons` 0.2.x) |
| Standar acuan | SVG 2 (W3C Candidate Recommendation, path data grammar, tinjauan 2026-10-01); WAI-ARIA 1.2 dan pola "SVG sebagai gambar" untuk aksesibilitas; CSS Custom Properties Level 1; CSS Values and Units Level 4 |
| Vector | `vectors/lombokicons-vectors-v1.json` — 241 kasus (207 ikon x mode + 34 opsi) — SHA-256 `6ff9dcc310b2194ccdc791b94b3116bfa1d747b646a85d4dab4be77dd8193f97` |
| Pemeriksa referensi | implementasi Python independen di `vectors/build_vectors.py` |
| Referensi | JavaScript (`src/js/runtime.js` + `scripts/build.js`) |
| Tanggal tinjauan | 2026-10-01 |

Kata MUST, MUST NOT, SHOULD, MAY mengikuti RFC 2119.

## 1. Data

`src/icons.json` adalah satu-satunya sumber data. `meta` = `{ viewBox: "0 0 24 24", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }`. `categories` memetakan nama kategori ke daftar nama ikon. `icons` memetakan nama ikon ke `{ line, bold_accent, duo_accent }`.

## 2. Aturan registri

1. Nama ikon: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`.
2. Setiap ikon muncul tepat sekali di `categories`, dan setiap nama di `categories` ada di `icons`.
3. `line` MUST berupa string path data; `bold_accent` dan `duo_accent` MUST berupa string path data atau `null`.
4. Path data hanya memakai karakter `MmLlHhVvCcSsQqTtAaZz0-9 .,eE+-`, mengikuti grammar path SVG 2 (flag arc boleh ditulis rapat, misalnya `0 01-1 1`).
5. Semua titik akhir, titik kontrol, dan titik busur MUST berada di dalam view box `[0, 24] x [0, 24]` (toleransi 0,01).
6. Build MUST gagal bila aturan 1-4 dilanggar; aturan 5 diperiksa oleh `tests/registry.test.mjs`.

## 3. Rendering (`renderIcon`, `renderIconData`)

### 3.1 Masukan

`renderIcon(name, opts)`: bila `name` bukan kunci milik sendiri dari `icons` (termasuk `__proto__`, `constructor`), hasil MUST string kosong. `renderIconData(icon, opts)`: bila `icon` tidak punya `line` bertipe string, hasil MUST string kosong.

### 3.2 Opsi

| Opsi | Aturan |
|---|---|
| `mode` | `line`, `bold`, atau `duo`; nilai lain berarti `line` |
| `class` | string; whitespace ASCII (SPACE, TAB, LF, FF, CR) di ujung dibuang dan setiap deret di tengah menjadi satu spasi |
| `size` | dipakai hanya bila cocok penuh `^(0|[0-9]+(\.[0-9]+)?(px|em|rem|%|vw|vh|vmin|vmax|pt|ch|ex))$` |
| `color` | dipakai hanya bila cocok penuh `^(#[0-9a-fA-F]{3,8}|[a-zA-Z]{3,30}|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\([0-9a-zA-Z.,% /+-]{1,64}\)|var\(--[a-zA-Z0-9_-]{1,64}\))$` |
| `title` | string tidak kosong memberi nama aksesibel; selain itu ikon dekoratif |

Semua kelas karakter di atas hanya ASCII.

### 3.3 Templat keluaran

```
<span class="lf{C}"{S}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"{A}>{T}{P}</svg></span>
```

- `{C}` = ` ` + `esc(class)` bila class tidak kosong.
- `{S}` = ` style="` + `esc(gabungan dengan ";" dari "--lf-size:" + size, lalu "--lf-color:" + color)` + `"` bila salah satunya dipakai.
- `{A}` = ` role="img" aria-label="esc(title)"` bila ada title, selain itu ` aria-hidden="true" focusable="false"`.
- `{T}` = `<title>esc(title)</title>` bila ada title.
- `{P}` berurutan: untuk `duo` dengan `duo_accent`: `<path d="DUO" class="lf-accent" fill="currentColor" opacity="0.32" stroke="none"/>`; selalu `<path d="LINE"/>`; untuk `bold` dengan `bold_accent`: `<path d="BOLD" class="lf-bold-fill" fill="currentColor" stroke="none"/>`.
- `esc` mengganti `&`, `<`, `>`, `"`, `'` dengan `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`.

### 3.4 `replaceIcons(root, mode)`

Untuk setiap elemen dengan atribut `data-lf` di dalam `root` (bawaan `document.body`): render dengan `mode` = `data-lf-mode` atau argumen `mode` atau `line`, `class` = atribut `class`, `title` = atribut `aria-label`; bila hasil tidak kosong, elemen diganti oleh hasil; ikon tak dikenal dibiarkan.

## 4. Artefak build

| Artefak | Isi |
|---|---|
| `dist/svg/<mode>/<nama>.svg` | SVG mandiri: `<svg xmlns viewBox fill stroke stroke-width stroke-linecap stroke-linejoin>` + path seperti §3.3 tanpa span/aria (duo: aksen lebih dulu; bold: aksen sesudah line) |
| `dist/svg/lombokicons-<mode>.svg` | sprite `<symbol id="lf-<nama>" viewBox="0 0 24 24">` per ikon |
| `dist/css/lombokicons(.min).css` | token `--lf-size`, `--lf-color`, `--lf-stroke`, `--lf-duo`, `--lf-duo-opacity`, kelas ukuran/stroke/animasi/transform, `prefers-reduced-motion`; versi minified <= 8 KB |
| `dist/js/lombokicons.mjs` / `.cjs` | API yang sama: konstanta `lf<NamaPascal>` per ikon (beku), `icons`, `categoryMap`, `count`, `version`, `renderIcon`, `renderIconData`, `replaceIcons`, `escapeAttr`, `isValidSize`, `isValidColor` |
| `dist/js/lombokicons.d.mts` / `.d.cts` | deklarasi TypeScript |
| `dist/catalog.json` | `{ version, total, categories: {nama: jumlah}, icons: [{ name, category, hasBoldAccent, hasDuoAccent }] }` |

Versi di modul, katalog, dan banner CSS MUST sama dengan `package.json`.

## 5. Keamanan (normatif)

1. Semua nilai dari pemanggil yang masuk ke HTML di-escape (`class`, `title`).
2. `size` dan `color` hanya diterima bila cocok pola §3.2; nilai lain diabaikan diam-diam sehingga tidak ada injeksi CSS (`;`, `url()`, `expression()`) maupun atribut.
3. Path data berasal dari registri yang divalidasi saat build, bukan dari pemanggil.
4. Ikon dekoratif disembunyikan dari teknologi asistif; ikon bermakna wajib diberi `title`.

## 6. Perubahan dari 0.1.0

`renderIcon` kini meng-escape `class`, memvalidasi dan menerapkan `size` serta `color`, menambah atribut aksesibilitas dan opsi `title`; CJS mendapat API lengkap; ekspor ESM per ikon tidak lagi memodifikasi objek bersama (dapat di-tree-shake); deklarasi tipe; versi diambil dari `package.json`.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
