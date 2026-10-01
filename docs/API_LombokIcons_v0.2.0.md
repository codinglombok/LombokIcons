# LombokIcons — API v0.2.0

Perilaku normatif: [SPEC_](SPEC_LombokIcons_v0.2.0.md).

## 1. JavaScript (`lombokicons`, ESM dan CJS identik)

| Ekspor | Jenis | Catatan |
|---|---|---|
| `renderIcon(name, opts?)` | fungsi | HTML `<span class="lf"><svg>...</svg></span>`; `''` untuk nama tak dikenal |
| `renderIconData(icon, opts?)` | fungsi | sama, menerima data satu ikon; dipakai bersama konstanta per ikon agar bundle kecil |
| `replaceIcons(root?, mode?)` | fungsi | mengganti elemen `[data-lf]` di DOM |
| `lfHome`, `lfArrowUp`, ... (69) | konstanta | data ikon beku `{ name, line, bold_accent, duo_accent }` |
| `icons` | objek beku | nama ke data ikon |
| `categoryMap` | objek beku | kategori ke daftar nama |
| `count`, `version` | nilai | 69, versi paket |
| `escapeAttr`, `isValidSize`, `isValidColor` | fungsi | utilitas yang dipakai renderer |

`opts`: `mode` (`'line' | 'bold' | 'duo'`), `size` (panjang CSS), `class`, `color` (warna CSS), `title` (nama aksesibel).

## 2. Ekspor paket

| Subpath | Berkas |
|---|---|
| `lombokicons` | `dist/js/lombokicons.mjs` / `.cjs` + tipe |
| `lombokicons/css`, `lombokicons/css/min` | CSS |
| `lombokicons/svg/<mode>/<nama>.svg`, `lombokicons/svg/lombokicons-<mode>.svg` | SVG mandiri dan sprite |
| `lombokicons/catalog` | `catalog.json` |

## 3. CSS

Token: `--lf-size` (1.25em), `--lf-color` (currentColor), `--lf-stroke` (1.5), `--lf-duo` (currentColor), `--lf-duo-opacity` (0.32). Kelas: ukuran `lf-xs`...`lf-3xl`, stroke `lf-thin`/`lf-normal`/`lf-bold`/`lf-heavy`, animasi `lf-spin`/`lf-pulse`/`lf-bounce`/`lf-shake`/`lf-ring` (dimatikan oleh `prefers-reduced-motion`), transform `lf-rotate-*`, `lf-flip-h`, `lf-flip-v`, dan `lf-stack`.

## 4. Contoh

```js
import { renderIcon, renderIconData, lfBell } from 'lombokicons'

renderIcon('home', { mode: 'duo', size: '2rem', title: 'Beranda' })
renderIconData(lfBell, { class: 'lf-ring' })   // hanya ikon bell yang masuk bundle
```

## 5. Kompatibilitas dengan 0.1.0

Nama dan tanda tangan 0.1.0 tetap ada. Keluaran `renderIcon` berubah: `class="lf"` tanpa spasi berlebih, atribut `aria-hidden`/`focusable` (atau `role`/`aria-label`), dan `style` dari `size`/`color`. `size` yang dulu diabaikan kini dipakai.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
