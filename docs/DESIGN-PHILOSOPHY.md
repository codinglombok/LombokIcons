# LombokIcons — Design Philosophy

## "Dimensional Clarity"

### The Problem with Existing Icon Libraries

Every major icon library converges on the same visual language: uniform stroke-width icons
on a square grid, differentiated only by whether strokes are thin or thick. Font Awesome is
heavy and font-based. Heroicons, Lucide, Phosphor, and Tabler are all SVG stroke icons that,
when placed side-by-side with labels removed, become nearly interchangeable. They solve
accessibility and consistency — but sacrifice character.

LombokIcons takes a different architectural position.

### Core Principle: Icons as Dimensional Objects

Instead of flat stroke drawings, every LombokIcons icon is constructed as if it has **depth**.
The design system uses a technique called **"inner light"** — a subtle secondary visual layer
that gives each icon the illusion of being a 3D object lit from the upper-left. This is
achieved purely through SVG path construction, not filters or effects.

Three expression modes emerge from this principle:

| Mode   | Visual Character                    | Use Case                        |
|--------|-------------------------------------|---------------------------------|
| `line` | Clean single-weight strokes (1.5px) | Body text, dense UI, tables     |
| `bold` | Thicker strokes + filled key areas  | Navigation, headers, emphasis   |
| `duo`  | Two-tone: primary + accent layer    | Hero sections, dashboards, CTAs |

The `duo` mode is LombokIcons' signature — the accent layer's color and opacity are fully
controlled via CSS custom properties, giving designers a two-color icon system without
multiple SVG files.

### Grid System: The Diamond Canon

All icons are drawn on a **24×24** viewBox, but the internal alignment uses a rotated
inner diamond (a square rotated 45°, inscribed at 2px inset). This produces:

```text
    ·  ·  ◆  ·  ·
    ·  ◆  ·  ◆  ·
    ◆  ·  ·  ·  ◆
    ·  ◆  ·  ◆  ·
    ·  ·  ◆  ·  ·
```

Key vertices and visual weight naturally gravitate toward the diamond's corners (top, right,
bottom, left) rather than the square's corners. This gives LombokIcons icons a distinctive
centered visual mass that feels balanced yet different from grid-locked competitors.

### Stroke Rules

- **Line mode**: 1.5px stroke, round cap, round join
- **Bold mode**: 2px stroke, round cap, round join + filled accent shapes
- **Duo mode**: Primary paths at `currentColor`, accent paths at `var(--lf-duo, currentColor)`
  with `var(--lf-duo-opacity, 0.32)` opacity

All strokes are **center-aligned** (SVG default) and designed so that at 1.5px,
the 24px viewBox renders crisply at 16px, 20px, 24px, 32px, and 48px display sizes.

### Naming Convention

Icons use **noun-first** naming: `file`, `file-text`, `file-code`, `file-zip`.
Verbs are suffixed: `arrow-up`, `arrow-down`, `chevron-right`.
State descriptors follow the noun: `eye-off`, `bell-ring`, `lock-open`.

No abbreviations. No brand-specific names. Every name should be guessable.

### CSS Architecture

LombokIcons provides a CSS-first consumption model:

```css
:root {
  --lf-size: 1.25em;      /* Scales with parent font-size */
  --lf-color: currentColor; /* Inherits text color */
  --lf-stroke: 1.5;        /* Stroke width */
  --lf-duo: currentColor;  /* Duo accent color */
  --lf-duo-opacity: 0.32;  /* Duo accent opacity */
}
```

Class pattern: `lf lf-{name}` with optional modifiers:

- Size: `lf-xs` (12px) · `lf-sm` (16px) · `lf-md` (20px) · `lf-lg` (24px) · `lf-xl` (32px) · `lf-2xl` (48px)
- Animation: `lf-spin` · `lf-pulse` · `lf-bounce` · `lf-shake`

### Color Philosophy

LombokIcons does NOT ship color. Icons inherit `currentColor` by default.
The duo accent layer uses a CSS custom property. This ensures icons integrate
seamlessly into any design system without fighting existing color tokens.

### What LombokIcons Is NOT

- Not a font file (no `.woff2`, no `@font-face`)
- Not a framework-specific component library (vanilla JS, use anywhere)
- Not a kitchen-sink of 5000+ icons (curated, \~200 essential icons at v1)
- Not opinionated about your build tool

### Delivery Formats

1. **CSS + SVG Sprite** — Single CSS file, single SVG sprite, works everywhere
2. **Individual SVGs** — Tree-shakeable imports for bundlers
3. **JS Module** — `import { IconHome } from 'lombokicons'` returns SVG string
4. **CDN** — jsDelivr, unpkg, single `<link>` tag
