# Changelog

All notable changes to LombokIcons will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- 226 integrity tests
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
