import { MMKV } from 'react-native-mmkv';
import { log, generateId } from '../logger';

export type TStorageAdapter = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
};

export class MMKVStorageAdapter implements TStorageAdapter {
  private storage: MMKV;

  constructor(id = 'rn-storage-kit.default') {
    this.storage = new MMKV({ id });
  }

  async get(key: string): Promise<string | null> {
    const start = Date.now();
    try {
      const result = this.storage.getString(key) ?? null;
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'get',
        key,
        result,
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

  async set(key: string, value: string): Promise<void> {
    const start = Date.now();
    try {
      this.storage.set(key, value);
      log({
        id: generateId(),
        timestamp: Date.now(),
        adapter: 'mmkv',
        operation: 'set',
        key,
        value,
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
