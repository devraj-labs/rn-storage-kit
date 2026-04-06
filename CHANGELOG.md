# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] — 2025-03-01

### Added
- `TStorageAdapter` generic type — adapters can now be typed against a schema (`MMKVStorageAdapter<TSchema>`).
- `SecureStorageAdapter` — Keychain-backed secure storage with the same `get/set/remove/clear/getAllKeys` interface.
- Key index for `SecureStorageAdapter` stored in a dedicated MMKV instance (`rn-storage-kit.secure-index`) so `getAllKeys` and `clear` work without Keychain enumeration support.
- Logger module (`enableLogger`, `disableLogger`, `getLogs`, `clearLogs`, `onNewLog`, `offNewLog`).
  - MMKV-persisted log entries survive Metro fast-refresh.
  - TTL-based auto-eviction.
  - `info` level strips `value`/`result` fields from entries.
  - Secure values always logged as `***` regardless of level.
  - Logger is a no-op in production unless `allowInProduction: true`.

### Changed
- Moved debug UI out of the package into the example app.
- Dropped `vajra-ui-core` dependency from the package.

---

## [0.1.0] — 2025-01-15

### Added
- `MMKVStorageAdapter` — MMKV-backed key-value storage with `get/set/remove/clear/getAllKeys`.
- Initial package setup with TypeScript strict mode, ESLint, Prettier, Husky, and lint-staged.
- Example app (`examples/storage-kit-example`) for iOS and Android.
