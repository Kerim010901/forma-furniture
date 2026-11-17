// Storage may be disabled or contain values from an earlier version.
export function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return key === "forma-lang" ? value : JSON.parse(value);
  } catch {
    return fallback;
  }
}
export function writeStored(key, value) {
  try {
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    );
  } catch {
    /* The current session remains functional without persistent storage. */
  }
}
