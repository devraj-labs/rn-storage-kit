export type TStorageAdapter<TSchema extends Record<string, unknown> = Record<string, string>> = {
  get<K extends keyof TSchema & string>(key: K): Promise<TSchema[K] | null>;
  set<K extends keyof TSchema & string>(key: K, value: TSchema[K]): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
};
