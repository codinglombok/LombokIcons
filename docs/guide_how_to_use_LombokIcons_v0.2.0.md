# LombokIcons — Guide How to Use v0.2.0

## 1. Pemasangan

```bash
npm install lombokicons
```

Belum terbit di npm saat dokumen ini ditulis; sementara: `npm install github:codinglombok/LombokIcons` lalu `npm run build`.

## 2. HTML statis dengan sprite

```html
<link rel="stylesheet" href="node_modules/lombokicons/dist/css/lombokicons.min.css">
<svg class="lf lf-lg" aria-hidden="true"><use href="node_modules/lombokicons/dist/svg/lombokicons-line.svg#lf-home"/></svg>
```

## 3. Atribut data (tanpa build)

```html
<i data-lf="bell" data-lf-mode="duo" class="lf-lg lf-ring" aria-label="Notifikasi"></i>
<script type="module">
  import { replaceIcons } from 'lombokicons'
  replaceIcons()
</script>
```

## 4. Render di server (SSR, template PHP/Python melalui Node)

```js
import { renderIcon } from 'lombokicons'
const html = renderIcon('download', { mode: 'bold', class: 'lf-sm', title: 'Unduh laporan' })
```

## 5. Tema

```css
.brand { --lf-color: #0f766e; --lf-duo: #f59e0b; --lf-duo-opacity: .4; }
```

## 6. Skenario pemakaian

| Skenario | Contoh |
|---|---|
| Dasbor dan aplikasi admin | ikon navigasi dan aksi dengan mode duo |
| Situs statis / dokumentasi | sprite SVG tanpa JavaScript |
| Email HTML dan PDF | SVG mandiri per ikon |
| Aplikasi kios/HMI | ikon besar dengan stroke tebal (`lf-heavy`) |
| Rendering di server | `renderIcon` di Node.js tanpa DOM |

## 7. Aksesibilitas

Ikon tanpa `title` dianggap dekoratif (`aria-hidden="true"`). Untuk tombol yang hanya berisi ikon, beri `title` atau `aria-label` pada tombolnya.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
