# LombokIcons — Bahasa & i18n v0.2.0

| Atribut | Nilai |
|---|---|
| Tingkat i18n (masterplan §13) | **P** — label aksesibel diberikan pemanggil dalam bahasa apa pun; ikon arah perlu varian RTL |
| Katalog pesan | tidak ada pesan bawaan |
| Cakupan katalog saat ini | tidak berlaku (nama aksesibel dari pemanggil) |

## 1. Nama aksesibel

Opsi `title` (atau `aria-label` pada elemen `data-lf`) menerima teks Unicode apa pun dan di-escape. Library tidak menyertakan label bawaan karena makna ikon bergantung konteks (ikon `x` bisa berarti "tutup" atau "hapus").

## 2. RTL

Ikon berarah (`arrow-left`, `arrow-right`, `chevron-left`, `chevron-right`, `send`, `external-link`) harus dicerminkan pada antarmuka RTL. Gunakan kelas `lf-flip-h`, misalnya `[dir="rtl"] .lf-dir { }` di CSS aplikasi, atau tambahkan `lf-flip-h` saat merender untuk bahasa ar/fa/ur.

## 3. Rencana

Daftar ikon berarah dalam `catalog.json` (`directional: true`) agar cermin RTL dapat diterapkan otomatis.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
