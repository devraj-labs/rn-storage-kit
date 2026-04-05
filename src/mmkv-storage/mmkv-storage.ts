import { MMKV } from 'react-native-mmkv';
import { log, generateId } from '../logger';
import { TStorageAdapter } from '../types';

export class MMKVStorageAdapter<
  TSchema extends Record<string, unknown> = Record<string, string>,
> implements TStorageAdapter<TSchema> {
  private storage: MMKV;

  constructor(id = 'rn-storage-kit.default') {
    this.storage = new MMKV({ id });
  }

  async get<K extends keyof TSchema & string>(key: K): Promise<TSchema[K] | null> {
    const start = Date.now();
    try {
      const raw = this.storage.getString(key) ?? null;
      const result = raw !== null ? (JSON.parse(raw) as TSchema[K]) : null;
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'get',
        key,
        result: raw,
        durationMs: Date.now() - start,
        secure: false,
      });
      return result;
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'get',
        key,
        error: String(e),
        durationMs: Date.now() - start,
        secure: false,
      });
      throw e;
    }
  }

  async set<K extends keyof TSchema & string>(key: K, value: TSchema[K]): Promise<void> {
    const start = Date.now();
    try {
      const serialized = JSON.stringify(value);
      this.storage.set(key, serialized);
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'set',
        key,
        value: serialized,
        durationMs: Date.now() - start,
        secure: false,
      });
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'set',
        key,
        error: String(e),
        durationMs: Date.now() - start,
        secure: false,
      });
      throw e;
    }
  }

  async remove(key: string): Promise<void> {
    const start = Date.now();
    try {
      this.storage.delete(key);
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'remove',
        key,
        durationMs: Date.now() - start,
        secure: false,
      });
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'remove',
        key,
        error: String(e),
        durationMs: Date.now() - start,
        secure: false,
      });
      throw e;
    }
  }

  async clear(): Promise<void> {
    const start = Date.now();
    try {
      this.storage.clearAll();
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'clear',
        durationMs: Date.now() - start,
        secure: false,
      });
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'clear',
        error: String(e),
        durationMs: Date.now() - start,
        secure: false,
      });
      throw e;
    }
  }

  async getAllKeys(): Promise<string[]> {
    const start = Date.now();
    try {
      const keys = this.storage.getAllKeys();
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'getAllKeys',
        result: keys.join(', ') || '(empty)',
        durationMs: Date.now() - start,
        secure: false,
      });
      return keys;
    } catch (e) {
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'getAllKeys',
        error: String(e),
        durationMs: Date.now() - start,
        secure: false,
      });
      throw e;
    }
  }
}
