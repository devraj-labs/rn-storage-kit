import { MMKV } from 'react-native-mmkv';

export const DEFAULT_MMKV_ID = 'rn-storage-kit.default';

// All MMKV instance IDs that should appear in the data tab.
// Add any new adapter IDs here when creating additional MMKVStorageAdapter instances.
export const ALL_MMKV_IDS = [
  DEFAULT_MMKV_ID,
  'rn-storage-kit.todos',
  'rn-storage-kit.secure-index',
];

export function readMmkvData(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const id of ALL_MMKV_IDS) {
    try {
      const store = new MMKV({ id });
      for (const k of store.getAllKeys()) {
        const val = store.getString(k);
        if (val !== undefined) out[`[${id}] ${k}`] = val;
      }
    } catch {}
  }
  return out;
}
