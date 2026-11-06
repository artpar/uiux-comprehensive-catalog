export const searchSynonyms: Record<string, string[]> = {
  delete: ["destructive", "remove", "irreversible"],
  destructive: ["delete", "remove", "danger"],
  error: ["failure", "recovery", "failed"],
  ai: ["automation", "prompt", "suggestion"],
  filter: ["facet", "narrow", "search"],
  popup: ["modal", "dialog"],
  undo: ["recover", "restore", "reversible"]
};

export function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function closeSpelling(a: string, b: string) {
  if (a.length < 5 || Math.abs(a.length - b.length) > 1) return false;
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const previous = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = previous;
    }
  }
  return row[b.length] <= 1;
}

type Entry = { name: string; aliases?: string[]; searchText: string };

export function searchScore(entry: Entry, query: string) {
  const normalized = normalizeSearch(query);
  if (!normalized) return 0;
  const name = normalizeSearch(entry.name);
  const aliases = (entry.aliases ?? []).map(normalizeSearch);
  const titleWords = name.split(" ");
  const aliasWords = aliases.flatMap((alias) => alias.split(" "));
  const bodyWords = new Set(normalizeSearch(entry.searchText).split(" "));
  let score = name === normalized ? 1000 : aliases.includes(normalized) ? 800 : 0;
  for (const term of normalized.split(" ")) {
    const alternatives = [term, ...(searchSynonyms[term] ?? [])];
    const points = Math.max(...alternatives.map((word) => {
      if (titleWords.includes(word)) return word === term ? 100 : 50;
      if (aliasWords.includes(word)) return word === term ? 70 : 35;
      if (bodyWords.has(word)) return 5;
      if (term.length >= 3 && [...titleWords, ...aliasWords].some((name) => name.startsWith(word))) return 20;
      // Fuzzy matching is limited to names, not every incidental word in the corpus.
      if ([...titleWords, ...aliasWords].some((name) => closeSpelling(word, name))) return 10;
      return 0;
    }));
    if (!points) return 0;
    score += points;
  }
  return score;
}

export function rankSearch<T extends Entry>(entries: T[], query: string): T[] {
  if (!normalizeSearch(query)) return entries;
  return entries.map((entry) => ({ entry, score: searchScore(entry, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .map(({ entry }) => entry);
}
