const negativeForm = /\b(?:no|not|never|without|cannot|can't|couldn't|doesn't|don't|won't|isn't|aren't|shouldn't|hasn't|haven't|didn't|wouldn't|mustn't)\b/i;

/** Select a specific affirmative observation for the learner's reading path. */
export function affirmative(items: Array<string | undefined>, fallback: string) {
  return items.find((item): item is string => item !== undefined && item.trim().length > 0 && !negativeForm.test(item)) ?? fallback;
}

export function affirmativeMany(items: string[], limit: number, fallback: string) {
  const chosen = items.filter((item) => item.trim().length > 0 && !negativeForm.test(item)).slice(0, limit);
  return chosen.length ? chosen : [fallback];
}
