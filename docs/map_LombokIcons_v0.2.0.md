# LombokIcons — Map v0.2.0

## 1. Posisi di ekosistem

```
Cluster 01 Frontend, UI & Visualisasi · tingkat L0 (tanpa dependensi Lombok wajib)

L0  LombokIcons ──► LombokUI (L1, memakai CSS + Icons + Animate)
     dependensi wajib    : (tidak ada)
     dependensi opsional : (tidak ada); token warna dapat diambil dari LombokCSS lewat CSS custom properties
     dependensi dev      : esbuild (uji tree-shaking), typescript (uji tipe)
```

## 2. Contoh pemakai di ekosistem

| Pemakai | Pemakaian |
|---|---|
| LombokUI (library) | komponen tombol dan navigasi |
| LombokRAGDash (aplikasi) | ikon dasbor |
| LombokClarion (framework, opsional) | ikon panel admin |

## 3. Artefak x platform

| Artefak | Browser | Node.js (SSR) | Tanpa JS | Port lain |
|---|---|---|---|---|
| SVG mandiri, sprite, CSS | YA | YA | YA | dapat dipakai langsung dari bahasa apa pun |
| `renderIcon` | YA | YA | — | Python/PHP: belum (pemeriksa referensi Python hanya di `vectors/`) |

*Lisensi dokumen: Apache-2.0 · © codinglombok*
