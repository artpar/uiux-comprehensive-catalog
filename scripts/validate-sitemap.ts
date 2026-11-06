import { resolve } from "node:path";
import { validateSitemap } from "./lib/validate-sitemap";

const result = validateSitemap(resolve(process.argv[2] || "dist"));
if (result.failures.length) {
  console.error(result.failures.join("\n"));
  process.exit(1);
}
console.log(`Validated ${result.count} sitemap URLs against all generated canonical pages.`);
