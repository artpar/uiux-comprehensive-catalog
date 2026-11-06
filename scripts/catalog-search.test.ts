import assert from "node:assert/strict";
import { test } from "node:test";
import { rankSearch } from "../src/lib/catalog-search";

const records = [
  { name: "Accordion", searchText: "Keep the expanded panel stable." },
  { name: "Table", aliases: ["data table"], searchText: "Sort rows and columns in a table." },
  { name: "Data grid", searchText: "Edit a cell; use a table for read-only rows." },
  { name: "Modal dialog", aliases: ["popup"], searchText: "Contain focus for a short task." },
  { name: "Inline validation", searchText: "Show a recoverable error by its field." }
];
test("table ranks the exact pattern first and does not match stable", () => {
  assert.deepEqual(rankSearch(records, "table").map((entry) => entry.name), ["Table", "Data grid"]);
});
test("multiple query words must each match rather than returning every partial hit", () => {
  assert.deepEqual(rankSearch(records, "table rows").map((entry) => entry.name), ["Table", "Data grid"]);
  assert.deepEqual(rankSearch(records, "table banana"), []);
});
test("aliases and spelling recovery find the intended pattern", () => {
  assert.equal(rankSearch(records, "popup")[0].name, "Modal dialog");
  assert.equal(rankSearch(records, "modall")[0].name, "Modal dialog");
});
