# Changelog

All notable changes to LombokIcons will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] — 2026-10-01

Aligns the library with the Lombok Ecosystem v3.6 standards.

### Security
- `renderIcon` wrote the `class` option into the `class` attribute without escaping, and `replaceIcons` passed each element's `className` through the same path, allowing attribute injection. Classes and titles are now escaped; `size` and `color` are accepted only when they match strict CSS patterns.

### Added
- `title` option: `role="img"` with an accessible name; icons without a title are `aria-hidden="true" focusable="false"`.
- `size` and `color` options now take effect (`--lf-size`, `--lf-color` on the wrapper); `size` was documented but ignored in 0.1.0.
- `renderIconData(icon, opts)` and frozen per-icon constants (`lfHome`, ...) so bundlers can drop unused icons; verified with esbuild in CI.
- The CJS build now exposes the same API as ESM (`renderIcon`, `renderIconData`, `replaceIcons`, `categoryMap`, utilities).
- TypeScript declarations (`.d.mts`, `.d.cts`).
- Registry validation at build time and geometry tests (every point inside the 24 x 24 view box).
- `docs/SPEC_LombokIcons_v0.2.0.md`, 241 vectors with an independent Python reference renderer, ten standard documents, `scripts/lombok-doctor.sh`.

### Changed
- `renderIcon` output: `class="lf"` without a trailing space, ARIA attributes on the `<svg>`.
- Version strings in the modules and catalog come from `package.json`.
- Tests moved to `node:test` (329 tests); Node.js 20 or newer.

### Corrected claims
- The README advertised packages on GitHub Container Registry, Maven, NuGet, RubyGems, and SourceForge, and "226 tests passing". No release has been published yet; those badges were removed. The publish workflows remain and will run on the first release.

## [0.1.0] — 2026-08-31

### Added

- Initial release: 69 icons across 8 categories
- Triple rendering mode: line, bold, duo (207 total variants)
- CSS framework with custom properties (`--lf-size`, `--lf-color`, `--lf-stroke`, `--lf-duo`, `--lf-duo-opacity`)
- Size scale: `lf-xs` through `lf-3xl` (12px–64px)
- Stroke weight modifiers: `lf-thin`, `lf-normal`, `lf-bold`, `lf-heavy`
- 5 animations: `lf-spin`, `lf-pulse`, `lf-bounce`, `lf-shake`, `lf-ring`
- Transform utilities: rotate (45/90/180/270) and flip (h/v)
- Stack utility for layered icons
- `prefers-reduced-motion` support
- JavaScript API: `renderIcon()`, `replaceIcons()`, icon registry, category map
- Dual module format: ESM (`.mjs`) + CJS (`.cjs`)
- SVG sprites for all three modes
- Individual SVG files for tree-shaking
- `catalog.json` metadata
- Build script: `icons.json` → full dist pipeline
- 226 build-output checks
- Interactive showcase demo (`demo/showcase.html`)
- Design Philosophy documentation

### Categories

- Navigation (12): home, menu, search, arrows, chevrons, external-link
- Action (12): plus, minus, x, check, edit, trash, copy, download, upload, refresh, filter, sort
- Content (10): file, file-text, folder, image, video, music, link, bookmark, tag, clipboard
- Communication (6): mail, send, message, phone, bell, chat
- Interface (12): settings, user, users, lock, unlock, eye, eye-off, star, heart, info, warning, help
- Device (8): monitor, smartphone, globe, wifi, cloud, database, code, terminal
- Layout (6): grid, list, layers, sidebar, maximize, minimize
- Time (3): clock, calendar, timer
