const key = "uxpg:ui-principles:v1";

export function readPrincipleProgress(): Set<string> {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set();
  }
}

export function completePrinciple(id: string): boolean {
  try {
    const progress = readPrincipleProgress();
    progress.add(id);
    localStorage.setItem(key, JSON.stringify([...progress]));
    return true;
  } catch {
    return false;
  }
}
