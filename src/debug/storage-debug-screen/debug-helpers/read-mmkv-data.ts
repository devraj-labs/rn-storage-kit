import { MMKV } from 'react-native-mmkv';

export const DEFAULT_MMKV_ID = 'rn-storage-kit.default';

export function readMmkvData(id: string): Record<string, string> {
  try {
    const store = new MMKV({ id });
    const out: Record<string, string> = {};
    for (const k of store.getAllKeys()) {
      const val = store.getString(k);
      if (val !== undefined) out[k] = val;
    }
    return out;
  } catch {
    return {};
  }
}
