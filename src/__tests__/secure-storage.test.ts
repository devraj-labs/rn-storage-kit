import { SecureStorageAdapter } from '../secure-storage/secure-storage';
import { __clearStore } from '../__mocks__/react-native-keychain';
import { __resetAllInstances } from '../__mocks__/react-native-mmkv';

describe('SecureStorageAdapter', () => {
  let secure: SecureStorageAdapter;

  beforeEach(() => {
    __clearStore();
    __resetAllInstances();
    secure = new SecureStorageAdapter();
  });

  it('returns null for a key that does not exist', async () => {
    expect(await secure.get('missing')).toBeNull();
  });

  it('stores and retrieves a string value', async () => {
    await secure.set('auth_token', 'eyJhbGc');
    expect(await secure.get('auth_token')).toBe('eyJhbGc');
  });

  it('removes a key', async () => {
    await secure.set('token', 'abc');
    await secure.remove('token');
    expect(await secure.get('token')).toBeNull();
  });

  it('getAllKeys returns all stored keys', async () => {
    await secure.set('token', 'abc');
    await secure.set('refresh', 'xyz');
    const keys = await secure.getAllKeys();
    expect(keys).toContain('token');
    expect(keys).toContain('refresh');
    expect(keys).toHaveLength(2);
  });

  it('clear removes all keys', async () => {
    await secure.set('token', 'abc');
    await secure.set('refresh', 'xyz');
    await secure.clear();
    expect(await secure.getAllKeys()).toEqual([]);
    expect(await secure.get('token')).toBeNull();
  });

  it('does not include removed key in getAllKeys', async () => {
    await secure.set('a', '1');
    await secure.set('b', '2');
    await secure.remove('a');
    const keys = await secure.getAllKeys();
    expect(keys).not.toContain('a');
    expect(keys).toContain('b');
  });

  it('overwriting a key updates the value', async () => {
    await secure.set('pin', 'old');
    await secure.set('pin', 'new');
    expect(await secure.get('pin')).toBe('new');
  });
});
