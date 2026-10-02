# LombokIcons — Development IDE v0.2.0

## 1. Lingkungan

| Alat | Versi |
|---|---|
| Node.js | 20 LTS atau lebih baru (CI: 20, 22, 24) |
| Python | 3.10+ (pemeriksa referensi vector) |
| Bash | `scripts/lombok-doctor.sh` (Windows: Git Bash/WSL) |
| Editor SVG | opsional; path ditulis manual pada grid 24 x 24 |

## 2. Perintah

| Perintah | Fungsi |
|---|---|
| `npm ci` | pasang esbuild dan typescript (dev) |
| `npm run build` | validasi registri, bangkitkan `dist/` |
| `npm test` | `node --test` (registri, API, dist, vector, tree-shaking) |
| `npm run coverage` | test dengan ambang coverage |
| `npm run lint` | `tsc` pada deklarasi tipe |
| `npm run vectors` | bangun ulang vector dari pemeriksa Python |
| `npm run check` | build + lint + coverage + doctor |

## 3. Menambah ikon

1. Gambar path pada grid 24 x 24 sesuai `docs/DESIGN-PHILOSOPHY.md`.
2. Tambahkan ke `src/icons.json` (`line`, `bold_accent`, `duo_accent`) dan ke satu kategori.
3. `npm run build && npm test` (validasi nama, kategori, grammar path, batas view box).
4. `npm run vectors`, perbarui `vectors/SHA256SUMS` dan hash di SPEC, catat di `CHANGELOG.md`.

## 4. Arah pengembangan

Paket komponen React/Vue/Svelte tipis di atas `renderIconData`, penanda ikon berarah untuk RTL, port renderer PHP dan Python, perluasan set ikon.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
