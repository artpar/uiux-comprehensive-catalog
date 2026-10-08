const key = "uxpg:pattern-study:v1";

export function readPatternProgress(): Set<string> {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set();
  }
}

export function completePatternStudy(id: string): boolean {
  try {
    const progress = readPatternProgress();
    progress.add(id);
    localStorage.setItem(key, JSON.stringify([...progress]));
    return true;
  } catch {
    return false;
  }
}
