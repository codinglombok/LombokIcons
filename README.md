# LombokIcons

> 69 SVG icons in three render modes (line, bold, duo-tone) from one definition, themed with CSS custom properties. Static SVGs, sprites, CSS, and a tree-shakeable JavaScript API. Zero dependencies.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![CI](https://github.com/codinglombok/LombokIcons/actions/workflows/ci.yml/badge.svg)](https://github.com/codinglombok/LombokIcons/actions/workflows/ci.yml)
[![Icons](https://img.shields.io/badge/icons-69_%C3%97_3_modes-blue)](src/icons.json)
[![Lombok Ecosystem](https://img.shields.io/badge/Lombok-Ecosystem-2e7d5b?logo=github)](https://github.com/codinglombok)

Part of the [Lombok Ecosystem](https://github.com/codinglombok).

## Mengapa library ini? (Why this library?)

- **Three modes, one definition.** Every icon renders as `line` (1.5 px strokes), `bold` (strokes plus filled key areas), or `duo` (an accent layer whose colour and opacity come from CSS variables). No extra files per style.
- **Use it anywhere.** Plain SVG files and sprites work without JavaScript; the CSS is 2.2 KB minified; the JS API renders on the server or in the browser, and importing one icon with `renderIconData` bundles to under 4 KB (checked in CI with esbuild).
- **Safe and accessible output.** Options are escaped or validated, so a class, size, or colour from user input cannot inject attributes or CSS. Icons are `aria-hidden` unless you give them a `title`, which adds `role="img"` and an accessible name.
- **Checked geometry.** CI validates names, categories, SVG path syntax, and that every point stays inside the 24 x 24 view box.

## Install

```bash
npm install lombokicons
```

Not yet published to npm; until then install from GitHub (`npm install github:codinglombok/LombokIcons`) and run `npm run build`. After the first release the files are also on jsDelivr: `https://cdn.jsdelivr.net/npm/lombokicons@0.2.0/dist/css/lombokicons.min.css`.

## Usage

### Method 1: Data Attributes (Simplest)

```html
<link rel="stylesheet" href="lombokicons/dist/css/lombokicons.min.css">

<i data-lf="home"></i>
<i data-lf="search" data-lf-mode="duo"></i>
<i data-lf="bell" data-lf-mode="bold" class="lf-lg lf-ring"></i>

<script type="module">
  import { replaceIcons } from 'lombokicons';
  replaceIcons(); // auto-replaces all [data-lf] elements
</script>
```

### Method 2: JavaScript Rendering

```js
import { renderIcon } from 'lombokicons';

document.getElementById('icon-slot').innerHTML = renderIcon('star', {
  mode: 'duo',
  class: 'lf-xl'
});
```

### Method 3: Direct SVG (Copy-Paste)

```html
<span class="lf lf-lg">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"
       stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>
  </svg>
</span>
```

### Method 4: SVG Sprite

```html
<svg class="lf lf-lg" aria-hidden="true">
  <use href="lombokicons/dist/svg/lombokicons-line.svg#lf-home"/>
</svg>
```

## API

### CSS Custom Properties

```css
:root {
  --lf-size: 1.25em;       /* Icon size — scales with parent */
  --lf-color: currentColor; /* Stroke/fill color */
  --lf-stroke: 1.5;         /* Stroke width */
  --lf-duo: currentColor;   /* Duo accent color */
  --lf-duo-opacity: 0.32;   /* Duo accent opacity */
}
```

### Size Classes

| Class | Size |
| ------- | ------ |
| `lf-xs` | 12px |
| `lf-sm` | 16px |
| `lf-md` | 20px (default) |
| `lf-lg` | 24px |
| `lf-xl` | 32px |
| `lf-2xl` | 48px |
| `lf-3xl` | 64px |

### Stroke Classes

| Class | Weight |
| ------- | -------- |
| `lf-thin` | 1 |
| `lf-normal` | 1.5 |
| `lf-bold` | 2 |
| `lf-heavy` | 2.5 |

### Animations

| Class | Effect |
| ------- | -------- |
| `lf-spin` | Continuous rotation (loading) |
| `lf-pulse` | Opacity pulse (attention) |
| `lf-bounce` | Vertical bounce (notification) |
| `lf-shake` | Horizontal shake (error) |
| `lf-ring` | Bell-like ring (alert) |

All animations respect `prefers-reduced-motion: reduce`.

### Transforms

`lf-rotate-45` · `lf-rotate-90` · `lf-rotate-180` · `lf-rotate-270` · `lf-flip-h` · `lf-flip-v`

### JavaScript API

```js
import { renderIcon, replaceIcons, icons, categoryMap, count } from 'lombokicons';

// Render a single icon as HTML string
const html = renderIcon('home', {
  mode: 'duo',       // 'line' | 'bold' | 'duo'
  size: '2rem',      // CSS length; other values are ignored
  class: 'my-class', // Extra CSS classes (escaped)
  color: '#e53e3e',  // CSS colour; other values are ignored
  title: 'Home'      // Accessible name; omit for decorative icons
});

// Smallest bundle: import one icon constant
import { lfHome, renderIconData } from 'lombokicons';
renderIconData(lfHome, { mode: 'bold' });

// Auto-replace all <i data-lf="..."> elements in the DOM
replaceIcons(document.body, 'line');

// Access metadata
console.log(count);                // 69
console.log(categoryMap);          // { navigation: [...], action: [...], ... }
console.log(Object.keys(icons));   // ['home', 'menu', 'search', ...]
```

## Icon Catalog

### Navigation (12)

`home` · `menu` · `search` · `arrow-up` · `arrow-down` · `arrow-left` · `arrow-right` · `chevron-up` · `chevron-down` · `chevron-left` · `chevron-right` · `external-link`

### Action (12)

`plus` · `minus` · `x` · `check` · `edit` · `trash` · `copy` · `download` · `upload` · `refresh` · `filter` · `sort`

### Content (10)

`file` · `file-text` · `folder` · `image` · `video` · `music` · `link` · `bookmark` · `tag` · `clipboard`

### Communication (6)

`mail` · `send` · `message` · `phone` · `bell` · `chat`

### Interface (12)

`settings` · `user` · `users` · `lock` · `unlock` · `eye` · `eye-off` · `star` · `heart` · `info` · `warning` · `help`

### Device (8)

`monitor` · `smartphone` · `globe` · `wifi` · `cloud` · `database` · `code` · `terminal`

### Layout (6)

`grid` · `list` · `layers` · `sidebar` · `maximize` · `minimize`

### Time (3)

`clock` · `calendar` · `timer`

## Specification and documents

Rendering output is defined byte for byte in [docs/SPEC_LombokIcons_v0.2.0.md](docs/SPEC_LombokIcons_v0.2.0.md) and pinned by 241 shared vectors. API reference: [docs/API_LombokIcons_v0.2.0.md](docs/API_LombokIcons_v0.2.0.md). Repository layout: [docs/structure_repo_LombokIcons_v0.2.0.md](docs/structure_repo_LombokIcons_v0.2.0.md). Release process: [docs/how_to_dist_LombokIcons_v0.2.0.md](docs/how_to_dist_LombokIcons_v0.2.0.md).

## Known limitations

69 icons; no React/Vue/Svelte component packages yet; directional icons are not mirrored automatically for right-to-left layouts. See [Known limitations](docs/full_summary_project_LombokIcons_v0.2.0.md#2-batasan-yang-diketahui).

## Browser Support

All modern browsers: Chrome 80+, Firefox 78+, Safari 14+, Edge 80+. No IE11.

## Contributing

1. Fork the repository
2. Add icons to `src/icons.json` following the [Design Philosophy](docs/DESIGN-PHILOSOPHY.md)
3. Run `npm run build` to regenerate dist
4. Run `npm test` to verify (registry, geometry, API, build output, vectors)
5. Open a pull request

Icon contributions must follow the Diamond Canon grid and provide all three modes (line, bold_accent, duo_accent). Set accent fields to `null` when not applicable.

## Related libraries

- [LombokCSS](https://github.com/codinglombok/LombokCSS) — token-first CSS framework
- [LombokAnimate](https://github.com/codinglombok/LombokAnimate) — web animation library
- [LombokCharts](https://github.com/LombokEcosystem/LombokCharts) — dependency-free charts

## License

[Apache-2.0](LICENSE) — Copyright 2026 codinglombok
