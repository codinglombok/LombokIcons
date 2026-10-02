# LombokIcons — Structure Repo v0.2.0

```
LombokIcons/
├── README.md · CHANGELOG.md · CONTRIBUTING.md · SECURITY.md · LICENSE (Apache-2.0)
├── package.json · package-lock.json · tsconfig.check.json
├── release-please-config.json · .release-please-manifest.json
├── .github/workflows/   ci.yml · release-please.yml · npm-publish.yml · publish-packages.yml
├── src/
│   ├── icons.json       registri: meta, categories, icons (sumber tunggal)
│   ├── css/lombokicons.css
│   └── js/              runtime.js (renderer bersama) · lombokicons.d.ts (templat tipe)
├── scripts/             build.js (validasi + semua artefak) · lombok-doctor.sh
├── tests/               registry · api · dist · vectors · treeshake (*.test.mjs, node:test) · types.check.ts
├── vectors/             lombokicons-vectors-v1.json · SHA256SUMS · build_vectors.py (pemeriksa Python)
├── demo/showcase.html   galeri interaktif
├── dist/                hasil build (tidak di-commit)
└── docs/                10 dokumen publik + DESIGN-PHILOSOPHY.md; masterplan_/architecture_ internal (ADR-024)
```

*Lisensi dokumen: Apache-2.0 · © codinglombok*
