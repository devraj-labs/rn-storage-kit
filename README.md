# rn-storage-kit

A React Native storage library with a unified adapter interface, structured logging, and a developer debug UI.

- **MMKV** for regular key-value storage
- **Keychain** for sensitive values (tokens, passwords)
- **Logger** with levels, TTL, MMKV persistence, and production safety
- **Debug UI** — floating panel and full-screen inspector, dev-only

---

## Installation

```sh
npm install @devraj-labs/rn-storage-kit
```

### Peer dependencies

```sh
npm install react-native-mmkv react-native-keychain
```

Follow the native setup guides for both:
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [react-native-keychain](https://github.com/oblador/react-native-keychain)

---

## Usage

### MMKV storage

```ts
import { MMKVStorageAdapter } from '@devraj-labs/rn-storage-kit';

const storage = new MMKVStorageAdapter();
// or with a custom instance id:
const storage = new MMKVStorageAdapter('my-app.settings');

await storage.set('theme', 'dark');
const theme = await storage.get('theme');   // 'dark'
await storage.remove('theme');
await storage.clear();
const keys = await storage.getAllKeys();
```

### Secure storage (Keychain)

```ts
import { SecureStorageAdapter } from '@devraj-labs/rn-storage-kit';

const secure = new SecureStorageAdapter();

await secure.set('auth_token', 'eyJ...');
const token = await secure.get('auth_token');
await secure.remove('auth_token');
await secure.clear();
const keys = await secure.getAllKeys();
```

Secure values are stored in Keychain per-key via `setGenericPassword`. A key index is maintained in a separate MMKV instance (`rn-storage-kit.secure-index`) so `getAllKeys` and `clear` work without Keychain enumeration support.

---

## Logger

Logging is **disabled by default** and never runs in production unless explicitly opted in.

### Enable

```ts
import { enableLogger } from '@devraj-labs/rn-storage-kit';

// Call once at app startup, before any storage calls
enableLogger({
  level: 'debug',       // 'none' | 'error' | 'info' | 'debug'
  maxEntries: 200,      // FIFO cap (default: 200)
  ttl: 0,               // auto-evict entries older than N ms (0 = off)
  allowInProduction: false,
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

### Log entry shape (`TStorageLogEntry`)

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

Logs are persisted across Metro fast-refresh in a dedicated MMKV instance (`rn-storage-kit.logs`). Persistence writes happen asynchronously via `setImmediate` — storage call performance is unaffected. Secure values never reach the log store.

---

## Production safety

- Logger is a no-op in production unless `allowInProduction: true` is passed to `enableLogger`.
- Secure adapter values are always logged as `***`, regardless of log level.
- At `info` level, `value` and `result` fields are stripped from all entries.

---

## Debug UI

Two components are exported. Both render `null` in production (`!__DEV__`).

### `StorageDebugPanel`

Floating action button (FAB) that opens a slide-up modal showing the live log stream.

```tsx
import { StorageDebugPanel } from '@devraj-labs/rn-storage-kit';

// Place outside your ScrollView, at the root of the screen
<StorageDebugPanel />
```

Features: live log list, clear button, colour-coded by adapter and error state, secure entries shown in purple with masked values.

### `StorageDebugScreen`

Full-featured debug screen with two tabs.

```tsx
import { StorageDebugScreen } from '@devraj-labs/rn-storage-kit';

<StorageDebugScreen />
```

| Tab | Features |
|-----|----------|
| **Logs** | Live log stream, search by key/operation/error, toggle newest/oldest sort, clear |
| **MMKV Data** | Browse all keys and values in the default MMKV store, tap to expand, refresh, clear |

Secure (Keychain) data is intentionally excluded from the MMKV Data tab.

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
  mmkv-storage/          MMKVStorageAdapter + TStorageAdapter type
  secure-storage/        SecureStorageAdapter (Keychain-backed)
  logger/                Logger state, enableLogger, log levels, MMKV persistence
  debug/
    storage-debug-panel/ FAB + modal log viewer
    storage-debug-screen/ Full debug screen (data tab + logs tab)
  index.ts               Public barrel
```

---

## License

MIT
