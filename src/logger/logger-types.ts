// All type declarations for the logger module.
// No interfaces — use `type` only. All types prefixed with T.

export type TLogLevel = 'none' | 'error' | 'info' | 'debug';

export type TLoggerOptions = {
  /** Minimum level to record. Default: 'debug' when enabled. */
  level?: TLogLevel;
  /** Maximum number of entries kept (FIFO). Default: 200 */
  maxEntries?: number;
  /** Auto-delete entries older than this many ms. 0 = disabled. Default: 0 */
  ttl?: number;
  /** Allow logger to run in production builds. Default: false */
  allowInProduction?: boolean;
};

export type TStorageLogEntry = {
  id: string;
  timestamp: number;
  /** Which storage backend handled this call */
  adapter: 'mmkv' | 'secure';
  /** Which method was called */
  operation: 'set' | 'get' | 'remove' | 'clear' | 'getAllKeys';
  key?: string;
  /** Actual value for MMKV ops at debug level; '***' for secure ops; absent at info level */
  value?: string;
  result?: string | null;
  error?: string;
  durationMs: number;
  /** Whether this operation touched the secure (Keychain) store */
  secure: boolean;
};

export type TLogListener = (entry: TStorageLogEntry) => void;
