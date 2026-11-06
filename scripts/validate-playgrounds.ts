import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { patternMeta } from "../src/components/playgrounds/examples/shared";

const directory = resolve("src/components/playgrounds/examples");
const modules = new Set(readdirSync(directory).map((file) => file.replace(/\.tsx$/, "")));
const failures: string[] = [];
let count = 0;
for (const file of readdirSync("src/data/patterns").filter((file) => file.endsWith(".json"))) {
  const pattern = JSON.parse(readFileSync(`src/data/patterns/${file}`, "utf8")) as { id: string };
  const meta = patternMeta[pattern.id];
  if (!meta) { failures.push(`${pattern.id}: missing example metadata`); continue; }
  const moduleName = modules.has(pattern.id) ? pattern.id : `generic-${meta.group}`;
  try {
    const { default: Example } = await import(pathToFileURL(resolve(directory, `${moduleName}.tsx`)).href);
    const html = renderToStaticMarkup(createElement(Example, { patternId: pattern.id, meta }));
    for (const label of ["Good UI", "Bad UI", "Good UX", "Bad UX"]) {
      if (!html.includes(`<h3>${label}</h3>`)) failures.push(`${pattern.id}: ${label} is missing`);
    }
    if (!/<(?:button|input|select|textarea|a)\b/.test(html)) failures.push(`${pattern.id}: example has no operable controls`);
    count++;
  } catch (error) { failures.push(`${pattern.id}: ${error instanceof Error ? error.message : error}`); }
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Rendered all four example states for ${count} patterns using separate demo modules.`);
