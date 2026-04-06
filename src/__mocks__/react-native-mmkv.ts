const instances = new Map<string, Map<string, string>>();

export function __resetAllInstances(): void {
  instances.forEach((store) => store.clear());
}

export class MMKV {
  private store: Map<string, string>;

  constructor(options?: { id?: string }) {
    const id = options?.id ?? '__default__';
    if (!instances.has(id)) {
      instances.set(id, new Map());
    }
    this.store = instances.get(id)!;
  }

  getString(key: string): string | undefined {
    return this.store.get(key);
  }

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clearAll(): void {
    this.store.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }
}
