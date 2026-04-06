<div align="center">

<h1>RN Storage Kit</h1>

<p>Unified storage for React Native. One interface — fast key-value, encrypted secrets, and structured logs.</p>

[![npm version](https://img.shields.io/npm/v/@devraj-labs/rn-storage-kit?style=flat-square&color=blue)](https://www.npmjs.com/package/@devraj-labs/rn-storage-kit)
[![license](https://img.shields.io/npm/l/@devraj-labs/rn-storage-kit?style=flat-square)](./LICENSE)
[![react-native](https://img.shields.io/badge/react--native-%3E%3D0.73-blue?style=flat-square)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org)

</div>

---

**rn-storage-kit** gives you three batteries-included storage primitives behind a single, consistent `async get/set/remove/clear` interface:

| Primitive | Backed by | Use for |
|-----------|-----------|---------|
| `MMKVStorageAdapter` | [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) | Preferences, cache, state |
| `SecureStorageAdapter` | [react-native-keychain](https://github.com/oblador/react-native-keychain) | Tokens, passwords, secrets |
| Logger | MMKV-persisted, TTL-aware | Debug traces, production safety |

---

## Installation

```sh
npm install @devraj-labs/rn-storage-kit
```

### Peer dependencies

```sh
npm install react-native-mmkv react-native-keychain
```

Follow the native setup guides for both libraries:
- [react-native-mmkv setup](https://github.com/mrousavy/react-native-mmkv)
- [react-native-keychain setup](https://github.com/oblador/react-native-keychain)

---

## Usage

### MMKV storage

Fast, synchronous storage wrapped in a promise-based interface.

```ts
import { MMKVStorageAdapter } from '@devraj-labs/rn-storage-kit';

const storage = new MMKVStorageAdapter();
// optionally scope to a named MMKV instance:
const storage = new MMKVStorageAdapter('my-app.settings');

await storage.set('theme', 'dark');
const theme = await storage.get('theme');   // 'dark'
await storage.remove('theme');
await storage.clear();
const keys = await storage.getAllKeys();
```

### Secure storage (Keychain)

Identical interface — swap the adapter, get hardware-backed encryption.

```ts
import { SecureStorageAdapter } from '@devraj-labs/rn-storage-kit';

const secure = new SecureStorageAdapter();

await secure.set('auth_token', 'eyJ...');
const token = await secure.get('auth_token');
await secure.remove('auth_token');
await secure.clear();
const keys = await secure.getAllKeys();
```

> Secure values are stored in Keychain via `setGenericPassword` per key. A key index is maintained in a dedicated MMKV instance (`rn-storage-kit.secure-index`) so `getAllKeys` and `clear` work without Keychain enumeration support.

---

## Logger

Production-safe structured logging for every storage operation. **Disabled by default.**

### Enable

Call once at app startup, before any storage operations:

```ts
import { enableLogger } from '@devraj-labs/rn-storage-kit';

enableLogger({
  level: 'debug',           // 'none' | 'error' | 'info' | 'debug'
  maxEntries: 200,          // FIFO cap (default: 200)
  ttl: 0,                   // auto-evict entries older than N ms (0 = off)
  allowInProduction: false, // never logs in prod unless explicitly set
});
```

### Disable

```ts
import { disableLogger } from '@devraj-labs/rn-storage-kit';

disableLogger();
```

### Read and clear logs

```ts
import { getLogs, clearLogs } from '@devraj-labs/rn-storage-kit';

const entries = getLogs(); // TStorageLogEntry[]
clearLogs();
```

### Subscribe to new entries

```ts
import { onNewLog, offNewLog } from '@devraj-labs/rn-storage-kit';

const handler = (entry) => console.log(entry);
onNewLog(handler);
// later:
offNewLog(handler);
```

### Log levels

| Level | What is recorded |
|-------|-----------------|
| `none` | Nothing |
| `error` | Failed operations only |
| `info` | All operations — key and adapter visible, values/results stripped |
| `debug` | Full detail — key, value, result, duration. Secure values are always masked as `***` |

### Log entry shape

```ts
type TStorageLogEntry = {
  id: string;
  timestamp: number;
  adapter: 'mmkv' | 'secure';
  operation: 'set' | 'get' | 'remove' | 'clear' | 'getAllKeys';
  key?: string;
  value?: string;   // '***' for secure ops; absent at info level
  result?: string | null;
  error?: string;
  durationMs: number;
  secure: boolean;
};
```

### Persistence

Logs survive Metro fast-refresh via a dedicated MMKV instance (`rn-storage-kit.logs`). Writes are async via `setImmediate` — zero impact on storage call performance. Secure values never reach the log store.

---

## Production safety

- Logger is a no-op in production unless `allowInProduction: true` is passed to `enableLogger`.
- Secure adapter values are always logged as `***`, regardless of log level.
- At `info` level, `value` and `result` fields are stripped from all log entries.

---

## API reference

### `MMKVStorageAdapter`

| Method | Signature | Description |
|--------|-----------|-------------|
| `constructor` | `(id?: string)` | Custom MMKV instance ID. Default: `'rn-storage-kit.default'` |
| `get` | `(key: string) => Promise<string \| null>` | Returns value or `null` |
| `set` | `(key: string, value: string) => Promise<void>` | Stores a string value |
| `remove` | `(key: string) => Promise<void>` | Deletes a key |
| `clear` | `() => Promise<void>` | Clears the entire MMKV instance |
| `getAllKeys` | `() => Promise<string[]>` | Returns all stored keys |

### `SecureStorageAdapter`

Same interface as `MMKVStorageAdapter`. Backed by Keychain via `setGenericPassword` / `getGenericPassword` per service key.

### Logger

| Export | Signature | Description |
|--------|-----------|-------------|
| `enableLogger` | `(options?: TLoggerOptions) => void` | Activates logging |
| `disableLogger` | `() => void` | Deactivates logging |
| `getLogs` | `() => TStorageLogEntry[]` | Returns a copy of all current entries |
| `clearLogs` | `() => void` | Clears entries from memory and MMKV |
| `onNewLog` | `(cb: TLogListener) => void` | Subscribe to new entries |
| `offNewLog` | `(cb: TLogListener) => void` | Unsubscribe |

---

## Project structure

```
src/
  mmkv-storage/    MMKVStorageAdapter + TStorageAdapter type
  secure-storage/  SecureStorageAdapter (Keychain-backed)
  logger/          Logger state, enableLogger, log levels, MMKV persistence
  types/           Shared type definitions
  index.ts         Public barrel
```

---

## License

MIT
