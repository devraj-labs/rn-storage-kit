const store: Map<string, string> = new Map();

export async function setGenericPassword(
  username: string,
  password: string,
  options?: { service?: string },
): Promise<boolean> {
  const key = options?.service ?? username;
  store.set(key, password);
  return true;
}

export async function getGenericPassword(
  options?: { service?: string },
): Promise<{ username: string; password: string } | false> {
  const key = options?.service ?? '';
  const password = store.get(key);
  if (password === undefined) return false;
  return { username: key, password };
}

export async function resetGenericPassword(options?: { service?: string }): Promise<boolean> {
  const key = options?.service ?? '';
  store.delete(key);
  return true;
}

export function __clearStore(): void {
  store.clear();
}
