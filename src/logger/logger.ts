import { MMKV } from 'react-native-mmkv';
import {
  TLogLevel,
  TLoggerOptions,
  TLogListener,
  TStorageLogEntry,
} from './logger-types';

// ─── Persistence ───────────────────────────────────────────────────────────────
// Logs survive Metro fast-refresh by being persisted in a dedicated MMKV store.
// Secure values NEVER reach this store — they arrive already masked as '***'.

const LOG_STORE_ID = 'rn-storage-kit.logs';
const LOG_STORE_KEY = '__logs__';
const logStore = new MMKV({ id: LOG_STORE_ID });

function loadPersistedLogs(): TStorageLogEntry[] {
  try {
    const raw = logStore.getString(LOG_STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TStorageLogEntry[];
  } catch {
    return [];
  }
}

function persistLogs(entries: TStorageLogEntry[]): void {
  try {
    logStore.set(LOG_STORE_KEY, JSON.stringify(entries));
  } catch {
    // Non-blocking — in-memory list stays authoritative on failure.
  }
}

// ─── Internal state ────────────────────────────────────────────────────────────

const LEVEL_RANK: Record<TLogLevel, number> = {
  none: 0,
  error: 1,
  info: 2,
  debug: 3,
};

type TLoggerState = {
  enabled: boolean;
  level: TLogLevel;
  maxEntries: number;
  ttl: number;
  allowInProduction: boolean;
};

const state: TLoggerState = {
  enabled: false,
  level: 'debug',
  maxEntries: 200,
  ttl: 0,
  allowInProduction: false,
};

let logs: TStorageLogEntry[] = loadPersistedLogs();
const listeners = new Set<TLogListener>();
let counter = 0;

// ─── Public API ────────────────────────────────────────────────────────────────

export function enableLogger(options: TLoggerOptions = {}): void {
  state.enabled = true;
  if (options.level !== undefined) state.level = options.level;
  if (options.maxEntries !== undefined) state.maxEntries = options.maxEntries;
  if (options.ttl !== undefined) state.ttl = options.ttl;
  if (options.allowInProduction !== undefined) state.allowInProduction = options.allowInProduction;
}

export function disableLogger(): void {
  state.enabled = false;
}

export function getLogs(): TStorageLogEntry[] {
  return [...logs];
}

export function clearLogs(): void {
  logs = [];
  logStore.delete(LOG_STORE_KEY);
  listeners.forEach((cb) => cb(syntheticClearEntry()));
}

export function onNewLog(cb: TLogListener): void {
  listeners.add(cb);
}

export function offNewLog(cb: TLogListener): void {
  listeners.delete(cb);
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${++counter}`;
}

function shouldLog(entry: TStorageLogEntry): boolean {
  if (!__DEV__ && !state.allowInProduction) return false;
  if (!state.enabled) return false;
  if (state.level === 'none') return false;

  const rank = LEVEL_RANK[state.level];
  if (rank >= LEVEL_RANK.error && entry.error) return true;
  if (rank >= LEVEL_RANK.info && !entry.error) return true;
  return false;
}

/**
 * At 'info' level we confirm the operation happened but strip payload details.
 */
function applyLevelMask(entry: TStorageLogEntry): TStorageLogEntry {
  if (state.level === 'info') {
    const { value: _v, result: _r, ...rest } = entry;
    return rest;
  }
  return entry;
}

function evictExpired(entries: TStorageLogEntry[]): TStorageLogEntry[] {
  if (state.ttl <= 0) return entries;
  const cutoff = Date.now() - state.ttl;
  return entries.filter((e) => e.timestamp >= cutoff);
}

export function log(entry: TStorageLogEntry): void {
  if (!shouldLog(entry)) return;

  const masked = applyLevelMask(entry);

  logs = evictExpired(logs);
  logs.unshift(masked);
  if (logs.length > state.maxEntries) {
    logs = logs.slice(0, state.maxEntries);
  }

  // Persist asynchronously — never blocks the storage call
  setImmediate(() => persistLogs(logs));

  listeners.forEach((cb) => cb(masked));
}

function syntheticClearEntry(): TStorageLogEntry {
  return {
    id: generateId(),
    timestamp: Date.now(),
    adapter: 'mmkv',
    operation: 'clear',
    durationMs: 0,
    secure: false,
  };
}
