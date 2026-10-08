import { readdirSync, readFileSync } from "node:fs";
import { familyGuides } from "../src/data/family-guides";
import { principleForCategory, principleLearningOrder, uiPrinciples } from "../src/data/ui-principles";
import { familyLearningOrder, familyStudyRoutes, studySequence } from "../src/data/family-study-routes";
import { affirmative } from "../src/lib/lesson-copy";

const failures: string[] = [];
const patterns = readdirSync("src/data/patterns")
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(`src/data/patterns/${file}`, "utf8")) as { id: string; category: string; maturity: string });
const patternById = new Map(patterns.map((pattern) => [pattern.id, pattern]));
const categories = new Set(patterns.map((pattern) => pattern.category));
const principleIds = new Set(uiPrinciples.map((principle) => principle.id));
const negativeForm = /\b(?:no|not|never|without|cannot|can't|couldn't|doesn't|don't|won't|isn't|aren't|shouldn't|hasn't|haven't|didn't|wouldn't|mustn't)\b/i;

function checkCopy(label: string, values: string[]) {
  for (const value of values) {
    if (negativeForm.test(value)) failures.push(`${label}: negative-form wording: ${value}`);
  }
}

for (const principle of uiPrinciples) {
  if (principle.concepts.length < 3 || principle.method.length < 4 || principle.explanation.length < 2 || principle.review.length < 3 || principle.readings.length < 2) failures.push(`${principle.id}: incomplete chapter structure`);
  const prose = [principle.title, principle.outcome, principle.opening, ...principle.concepts.flatMap((term) => [term.term, term.meaning]), ...principle.explanation, ...principle.method, principle.strong, principle.weak, principle.reasoning, principle.practice, ...principle.review, ...principle.readings.flatMap((reading) => [reading.title, reading.purpose])];
  if (prose.join(" ").split(/\s+/).length < 200) failures.push(`${principle.id}: chapter needs more substance`);
  checkCopy(principle.id, prose);
  for (const id of principle.patternIds) if (!patternById.has(id)) failures.push(`${principle.id}: unknown pattern ${id}`);
  for (const reading of principle.readings) if (!reading.url.startsWith("https://")) failures.push(`${principle.id}: reading requires HTTPS`);
}

for (const category of categories) {
  const guide = familyGuides[category];
  const principleId = principleForCategory[category];
  if (!guide) { failures.push(`${category}: missing family guide`); continue; }
  if (!principleIds.has(principleId)) failures.push(`${category}: missing UI principle`);
  if (guide.method.length < 4 || guide.starterIds.length < 3) failures.push(`${category}: incomplete learning route`);
  checkCopy(category, [guide.question, guide.principle, ...guide.method, guide.strong, guide.weak, guide.practice]);
  for (const id of guide.starterIds) {
    const pattern = patternById.get(id);
    if (!pattern) failures.push(`${category}: unknown starter ${id}`);
    else if (pattern.category !== category) failures.push(`${category}: starter ${id} belongs to ${pattern.category}`);
  }
  const route = familyStudyRoutes[category];
  if (!route) { failures.push(`${category}: missing complete study route`); continue; }
  const sequence = studySequence(category);
  if (new Set(sequence).size !== sequence.length) failures.push(`${category}: repeated pattern in study route`);
  const expected = patterns.filter((pattern) => pattern.category === category).map((pattern) => pattern.id);
  for (const id of expected) if (!sequence.includes(id)) failures.push(`${category}: missing route entry ${id}`);
  for (const id of sequence) if (patternById.get(id)?.category !== category) failures.push(`${category}: route entry ${id} belongs to another family`);
  for (const id of guide.starterIds) if (!route.foundations.includes(id)) failures.push(`${category}: starter ${id} should appear in foundations`);
  for (const id of route.qualityChecks) if (patternById.get(id)?.maturity !== "anti-pattern") failures.push(`${category}: quality check ${id} should be an anti-pattern`);
  for (const id of expected) if (patternById.get(id)?.maturity === "anti-pattern" && !route.qualityChecks.includes(id)) failures.push(`${category}: anti-pattern ${id} should appear in quality checks`);
}

for (const category of Object.keys(familyGuides)) if (!categories.has(category)) failures.push(`orphan family guide: ${category}`);
if (new Set(familyLearningOrder).size !== categories.size || familyLearningOrder.some((category) => !categories.has(category))) failures.push("curriculum family order must cover every family once");
for (const file of readdirSync("src/data/patterns").filter((name) => name.endsWith(".json"))) {
  const pattern = JSON.parse(readFileSync(`src/data/patterns/${file}`, "utf8")) as {
    id: string; name: string; solution: string; useWhen: string[]; problemContext: string[];
    uxGuidance: string[]; selectionRules: string[]; requiredStates: string[];
    critiqueQuestions: string[]; interactionContract: string[];
  };
  const use = affirmative(pattern.useWhen, `Use ${pattern.name.toLowerCase()} for the task shown in the worked example.`);
  const state = affirmative(pattern.requiredStates, "Show the current state and the person's next action.");
  checkCopy(`${pattern.id} learner path`, [
    use,
    affirmative(pattern.problemContext, use),
    affirmative([pattern.solution, ...pattern.uxGuidance, ...pattern.selectionRules], use),
    state,
    affirmative(pattern.critiqueQuestions, "Can a person complete this task and explain the result?"),
    affirmative(pattern.interactionContract, state)
  ]);
}
for (const file of readdirSync("src/data/comparisons").filter((name) => name.endsWith(".json"))) {
  const comparison = JSON.parse(readFileSync(`src/data/comparisons/${file}`, "utf8")) as { id: string; summary: string; decisionRules: string[]; failureModes: string[] };
  checkCopy(`${comparison.id} learner path`, [
    affirmative([comparison.summary, ...comparison.decisionRules], "Choose the interaction that supports the person's task and its outcome."),
    affirmative(comparison.failureModes, "A person reaches a result and needs a clear route to continue.")
  ]);
}
if (uiPrinciples.length !== 14) failures.push(`expected 14 principle chapters, found ${uiPrinciples.length}`);
if (new Set(principleLearningOrder).size !== uiPrinciples.length || principleLearningOrder.some((id) => !principleIds.has(id))) failures.push("principle learning order must cover every chapter once");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Validated ${uiPrinciples.length} UI principle chapters and ${categories.size} guided pattern families across ${patterns.length} patterns.`);
