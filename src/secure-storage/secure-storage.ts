import * as Keychain from 'react-native-keychain';
import { MMKV } from 'react-native-mmkv';
import { log, generateId } from '../logger';
import { TStorageAdapter } from '../mmkv-storage';

// ─── Key index ─────────────────────────────────────────────────────────────────
// Keychain has no key-enumeration API so we maintain a small index in MMKV.
// This index stores only keys, never secret values.

const keysIndex = new MMKV({ id: 'rn-storage-kit.secure-index' });
const SECURE_KEYS_INDEX = '__secure_keys__';

function getKeyIndex(): string[] {
  const raw = keysIndex.getString(SECURE_KEYS_INDEX);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function addToKeyIndex(key: string): void {
  const keys = getKeyIndex();
  if (!keys.includes(key)) {
    keys.push(key);
    keysIndex.set(SECURE_KEYS_INDEX, JSON.stringify(keys));
  }
}

function removeFromKeyIndex(key: string): void {
  const keys = getKeyIndex().filter((k) => k !== key);
  keysIndex.set(SECURE_KEYS_INDEX, JSON.stringify(keys));
}

function clearKeyIndex(): void {
  keysIndex.delete(SECURE_KEYS_INDEX);
}

// ─── Value masking ─────────────────────────────────────────────────────────────
// Secure values are NEVER written to logs in plain text.
// We log the sentinel '***' so the entry shows the field exists without exposing the secret.

const MASKED = '***';

export class SecureStorageAdapter implements TStorageAdapter {
  async get(key: string): Promise<string | null> {
    const start = Date.now();
    try {
      const creds = await Keychain.getGenericPassword({ service: key });
      const result = creds ? creds.password : null;
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'get',
        key,
        result: result !== null ? MASKED : null,
        durationMs: Date.now() - start,
        secure: true,
      });
      return result;
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'get',
        key,
        error: String(e),
        durationMs: Date.now() - start,
        secure: true,
      });
      throw e;
    }
  }

  async set(key: string, value: string): Promise<void> {
    const start = Date.now();
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
      addToKeyIndex(key);
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'set',
        key,
        value: MASKED,
        durationMs: Date.now() - start,
        secure: true,
      });
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'set',
        key,
        error: String(e),
        durationMs: Date.now() - start,
        secure: true,
      });
      throw e;
    }
  }

  async remove(key: string): Promise<void> {
    const start = Date.now();
    try {
      await Keychain.resetGenericPassword({ service: key });
      removeFromKeyIndex(key);
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'remove',
        key,
        durationMs: Date.now() - start,
        secure: true,
      });
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'remove',
        key,
        error: String(e),
        durationMs: Date.now() - start,
        secure: true,
      });
      throw e;
    }
  }

  async clear(): Promise<void> {
    const start = Date.now();
    try {
      const keys = getKeyIndex();
      await Promise.all(keys.map((k) => Keychain.resetGenericPassword({ service: k })));
      clearKeyIndex();
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'clear',
        durationMs: Date.now() - start,
        secure: true,
      });
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'clear',
        error: String(e),
        durationMs: Date.now() - start,
        secure: true,
      });
      throw e;
    }
  }

  async getAllKeys(): Promise<string[]> {
    const start = Date.now();
    try {
      const keys = getKeyIndex();
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'getAllKeys',
        result: keys.join(', ') || '(empty)',
        durationMs: Date.now() - start,
        secure: true,
      });
      return keys;
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'secure',
        operation: 'getAllKeys',
        error: String(e),
        durationMs: Date.now() - start,
        secure: true,
      });
      throw e;
    }
  }
}
