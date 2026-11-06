import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const directory = "dist/_astro";
const limit = 400_000;
const scripts = readdirSync(directory).filter((file) => file.endsWith(".js"))
  .map((file) => ({ file, bytes: statSync(join(directory, file)).size }));
const oversized = scripts.filter(({ bytes }) => bytes > limit);
if (oversized.length) {
  console.error(oversized.map(({ file, bytes }) => `${file}: ${bytes} bytes exceeds the ${limit}-byte JavaScript chunk budget. Split the module before release.`).join("\n"));
  process.exit(1);
}
console.log(`Validated ${scripts.length} JavaScript chunks; largest is ${Math.max(...scripts.map(({ bytes }) => bytes))} bytes (budget ${limit}).`);
