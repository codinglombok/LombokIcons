# Contributing to LombokIcons

Thank you for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/codinglombok/LombokIcons.git
cd LombokIcons
npm ci
npm run build
npm test
```

## Adding Icons

1. Edit `src/icons.json` — add your icon under the appropriate category
2. Each icon needs:
   - `line`: SVG path data for the line (1.5px stroke) mode
   - `bold_accent`: Path data for the bold accent fill (or `null`)
   - `duo_accent`: Path data for the duo-tone accent layer (or `null`)
3. Follow the [Design Philosophy](docs/DESIGN-PHILOSOPHY.md):
   - 24×24 viewBox, Diamond Canon grid alignment
   - 1.5px stroke, round cap, round join
   - Noun-first naming: `file-text`, not `text-file`
4. Run `npm run build` to regenerate dist
5. Run `npm test` — all tests must pass (names, categories, path syntax, 24 x 24 bounds, rendering vectors)
6. Run `npm run vectors`, update `vectors/SHA256SUMS` and the hash in the SPEC, and add a `CHANGELOG.md` entry

## Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org):

| Prefix | When to use | Triggers release? |
| -------- | ------------- | ------------------- |
| `feat:` | New icons, new CSS classes, new API | Yes (minor) |
| `fix:` | Bug fixes in dist files | Yes (patch) |
| `docs:` | Documentation only | No |
| `ci:` | Workflow changes | No |
| `chore:` | Tooling, config | No |
| `test:` | Test changes | No |

**Important**: `fix:` and `feat:` trigger a release. If your change only touches `docs/`, `.github/`, or `scripts/`, use `docs:`, `ci:`, or `chore:` instead.

## Code of Conduct

Be respectful, constructive, and inclusive.

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.
