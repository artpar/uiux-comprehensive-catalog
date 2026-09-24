export type LessonProgress = {
  taught?: boolean;
  choice?: number;
  confidence?: string;
  reason?: string;
  artifact?: string;
  completed?: boolean;
  updatedAt?: string;
};

const key = "uxpg:learning:v1";

export function learningStorageAvailable(): boolean {
  try { localStorage.getItem(key); return true; } catch { return false; }
}

export function readLearningProgress(): Record<string, LessonProgress> {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export function saveLessonProgress(id: string, patch: Partial<LessonProgress>): boolean {
  try {
    const progress = readLearningProgress();
    progress[id] = { ...progress[id], ...patch, updatedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent("uxpg:learning-progress"));
    return true;
  } catch {
    return false;
  }
}

export function countCompleted(progress = readLearningProgress()): number {
  return Object.values(progress).filter((entry) => entry.completed).length;
}

export function resumeLessonId(ids: string[], progress = readLearningProgress()): string | undefined {
  const recent = ids.filter((id) => progress[id] && !progress[id].completed)
    .sort((a, b) => (progress[b]?.updatedAt || "").localeCompare(progress[a]?.updatedAt || ""))[0];
  return recent || ids.find((id) => !progress[id]?.completed);
}
