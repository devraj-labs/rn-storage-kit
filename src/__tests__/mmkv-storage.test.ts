import { MMKVStorageAdapter } from '../mmkv-storage/mmkv-storage';
import { __resetAllInstances } from '../__mocks__/react-native-mmkv';

describe('MMKVStorageAdapter', () => {
  let storage: MMKVStorageAdapter;

  beforeEach(() => {
    __resetAllInstances();
    storage = new MMKVStorageAdapter('test-instance');
  });

  it('returns null for a key that does not exist', async () => {
    expect(await storage.get('missing')).toBeNull();
  });

  it('stores and retrieves a string value', async () => {
    await storage.set('theme', 'dark');
    expect(await storage.get('theme')).toBe('dark');
  });

  it('stores and retrieves a non-string value via JSON', async () => {
    const adapter = new MMKVStorageAdapter<{ count: number }>('typed-instance');
    await adapter.set('count', 42 as any);
    expect(await adapter.get('count')).toBe(42);
  });

  it('removes a key', async () => {
    await storage.set('key', 'value');
    await storage.remove('key');
    expect(await storage.get('key')).toBeNull();
  });

  it('clears all keys', async () => {
    await storage.set('a', '1');
    await storage.set('b', '2');
    await storage.clear();
    expect(await storage.getAllKeys()).toEqual([]);
  });

  it('returns all keys', async () => {
    await storage.set('x', '1');
    await storage.set('y', '2');
    const keys = await storage.getAllKeys();
    expect(keys).toContain('x');
    expect(keys).toContain('y');
    expect(keys).toHaveLength(2);
  });

  it('overwriting a key updates the value', async () => {
    await storage.set('mode', 'light');
    await storage.set('mode', 'dark');
    expect(await storage.get('mode')).toBe('dark');
  });

  it('uses separate stores for different instance IDs', async () => {
    const a = new MMKVStorageAdapter('store-a');
    const b = new MMKVStorageAdapter('store-b');
    await a.set('key', 'from-a');
    expect(await b.get('key')).toBeNull();
  });
});
