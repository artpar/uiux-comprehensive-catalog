import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { priorityEditorial } from "../src/data/priority-editorial";

const failures: string[] = [];
const baseline = JSON.parse(readFileSync("research/growth-remediation-baseline.json", "utf8")) as { priorityPages: Array<{ path: string }> };
const expected = new Set(baseline.priorityPages.map((page) => page.path));
const patterns = new Set(readdirSync("src/data/patterns").map((file) => file.replace(/\.json$/, "")));
const paths = new Set<string>();
const questions = new Set<string>();
const today = new Date().toISOString().slice(0, 10);
const built = process.argv.includes("--built");
const decode = (text: string) => text.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, value: string) => String.fromCodePoint(value[0].toLowerCase() === "x" ? parseInt(value.slice(1), 16) : parseInt(value, 10)))
  .replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&apos;", "'");

for (const decision of priorityEditorial) {
  const fail = (message: string) => failures.push(`${decision.path}: ${message}`);
  if (!expected.has(decision.path)) fail("not in the priority-page inventory");
  if (paths.has(decision.path)) fail("duplicate path");
  if (questions.has(decision.question)) fail("decision question repeated on another priority page");
  paths.add(decision.path); questions.add(decision.question);
  if (decision.rows.length < 3 || decision.rows.some((row) => row.length !== decision.columns.length || row.some((cell) => !cell.trim()))) fail("state table is incomplete");
  if (decision.checks.length < 3 || !decision.evidence.length) fail("checks or source claims missing");
  for (const field of ["title", "description", "question", "answer", "scenario", "reasoning", "boundary"] as const) if (!decision[field].trim()) fail(`${field} is empty`);
  for (const date of [decision.updated, decision.sourcesChecked]) if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || date > today) fail(`invalid or future editorial date: ${date}`);
  for (const id of decision.patternIds) if (!patterns.has(id)) fail(`unknown example pattern ${id}`);
  for (const source of decision.evidence) {
    if (!source.title || !source.claim || !source.url.startsWith("https://")) fail("source needs a title, supported claim, and HTTPS URL");
  }
  if (!built) continue;
  const file = join("dist", decision.path.slice(1), "index.html");
  if (!existsSync(file)) { fail("built page is missing"); continue; }
  const html = readFileSync(file, "utf8");
  const text = decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ");
  for (const value of [decision.question, decision.scenario, decision.caption, decision.rows[0][1], decision.boundary]) if (!text.includes(value.replace(/\s+/g, " "))) fail("worked content missing from rendered HTML");
  if (!text.includes("constructed example") || !html.includes("editorial-byline")) fail("scenario label or editorial attribution missing");
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) fail("page must have one primary heading");
  const json = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  const parsed = json ? JSON.parse(json) : [];
  const article = (Array.isArray(parsed) ? parsed : [parsed]).find((item) => item["@type"] === "Article");
  if (!article || article.headline !== decision.title || article.dateModified !== decision.updated || article.author?.name !== "UX Patterns Guide") fail("article metadata disagrees with editorial content");
  for (const source of decision.evidence) if (!html.includes(source.url) || !article?.citation?.includes(source.url)) fail(`source absent from page or article metadata: ${source.title}`);
}
for (const path of expected) if (!paths.has(path)) failures.push(`${path}: priority page has no worked decision`);
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Validated ${paths.size} distinct priority-page decisions${built ? ", rendered content, attribution, and article metadata" : " with source claims and example routes"}.`);
