const PREFIX = 'khovera-demo';

export const STORAGE_KEYS = {
  submissions: `${PREFIX}:submissions`,
  stage: `${PREFIX}:stage`,
  view: `${PREFIX}:view`,
  draft: `${PREFIX}:draft`,
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / serialization errors in the demo.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // No-op.
  }
}

export function resetDemoData(): void {
  Object.values(STORAGE_KEYS).forEach(removeKey);
}
