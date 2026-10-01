# LombokIcons — How to Dist v0.2.0

## 1. Registry

| Registry | Nama | Status | Mekanisme |
|---|---|---|---|
| npm | `lombokicons` | belum terbit | `release-please.yml` lalu `npm-publish.yml` (provenance, `NPM_TOKEN`) |
| GitHub Packages npm | `@codinglombok/lombokicons` via npm.pkg.github.com | belum terbit | `publish-packages.yml` |
| ghcr.io | `ghcr.io/codinglombok/lombokicons` (image berisi `dist/`) | belum terbit | `publish-packages.yml` |
| Maven (GitHub Packages) | webjar `com.github.codinglombok:lombokicons` | belum terbit | `publish-packages.yml` |
| NuGet / RubyGems (GitHub Packages) | `codinglombok.LombokIcons` / `lombokicons` | belum terbit | `publish-packages.yml` |
| jsDelivr / unpkg | `lombokicons` | otomatis setelah npm | `https://cdn.jsdelivr.net/npm/lombokicons@0.2.0/dist/css/lombokicons.min.css` |

## 2. Alur rilis

1. PR dengan CI hijau (build, tipe, test + coverage, vector, doctor, `npm pack --dry-run`).
2. Rilis pertama (0.2.0): versi sudah ditulis di `package.json`, `CHANGELOG.md`, dan `.release-please-manifest.json`. Setelah merge, buat tag `v0.2.0` pada commit merge, lalu jalankan workflow "Publish to npm" (workflow_dispatch) pada tag itu.
3. Rilis berikutnya: release-please membuka PR rilis dari Conventional Commits; merge PR rilis membuat tag dan menjalankan publish npm serta GitHub Packages.

```powershell
git switch main ; git pull
git tag v0.2.0 ; git push origin v0.2.0
gh workflow run npm-publish.yml --ref v0.2.0
npm view lombokicons@0.2.0 version
```

Rollback: `npm deprecate lombokicons@0.2.0 "gunakan 0.2.1"`.

*Lisensi dokumen: Apache-2.0 · © codinglombok*
