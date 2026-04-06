# Contributing to rn-storage-kit

Thanks for taking the time to contribute.

## Getting started

```sh
git clone https://github.com/devraj-labs/rn-storage-kit.git
cd rn-storage-kit
npm install
```

## Development workflow

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm test` | Run the test suite |
| `npm run lint` | Lint `src/` |
| `npm run format` | Auto-format `src/` with Prettier |

## Coding guidelines

All code must follow [CODING_GUIDELINES.md](./CODING_GUIDELINES.md). Key rules:

- `type` only — no `interface` anywhere in the project.
- All types prefixed with `T` (e.g. `TStorageAdapter`).
- Named exports only — no default exports.
- Kebab-case filenames.
- Every module in its own folder with a barrel `index.ts`.

## Submitting a pull request

1. Fork the repo and create a branch from `main`.
2. Add or update tests for any behaviour you change.
3. Make sure `npm test` and `npm run lint` pass.
4. Open a PR against `main` with a clear description of _what_ and _why_.

## Reporting a bug

Open an issue and include:

- Library version
- React Native version
- Platform (iOS / Android)
- Minimal reproduction steps or a code snippet

## Releasing (maintainers only)

1. Bump the version in `package.json` following [semver](https://semver.org).
2. Update `CHANGELOG.md`.
3. Run `npm run release` (builds and publishes to npm).
