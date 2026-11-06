import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { contentModifiedDates } from "../src/lib/content-modified";
import { validateSitemap } from "./lib/validate-sitemap";

function fixture() {
  const directory = mkdtempSync(join(tmpdir(), "ux-sitemap-"));
  return {
    directory,
    write(path: string, value: string) {
      const target = join(directory, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, value);
    },
    cleanup: () => rmSync(directory, { recursive: true, force: true })
  };
}

test("coverage detects an omitted canonical page, including a new chapter", () => {
  const f = fixture();
  try {
    f.write("index.html", '<link rel="canonical" href="https://example.com/">');
    f.write("principles/new-chapter/index.html", '<link href="https://example.com/principles/new-chapter/" rel="canonical">');
    f.write("sitemap.xml", "<urlset><url><loc>https://example.com/</loc></url></urlset>");
    assert.match(validateSitemap(f.directory).failures.join("\n"), /new-chapter.*missing from sitemap/);
    f.write("sitemap.xml", "<urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/principles/new-chapter/</loc></url></urlset>");
    assert.deepEqual(validateSitemap(f.directory), { count: 2, failures: [] });
  } finally { f.cleanup(); }
});

test("coverage rejects duplicate URLs, nonexistent pages, and invented dates", () => {
  const f = fixture();
  try {
    f.write("index.html", '<link rel="canonical" href="https://example.com/">');
    f.write("sitemap.xml", "<urlset><url><loc>https://example.com/</loc><lastmod>2026-02-30</lastmod></url><url><loc>https://example.com/</loc></url><url><loc>https://example.com/missing/</loc><lastmod>2999-01-01</lastmod></url></urlset>");
    const errors = validateSitemap(f.directory).failures.join("\n");
    assert.match(errors, /duplicate URLs/);
    assert.match(errors, /no indexable canonical HTML page.*missing/);
    assert.match(errors, /Invalid or future lastmod: 2026-02-30/);
    assert.match(errors, /Invalid or future lastmod: 2999-01-01/);
  } finally { f.cleanup(); }
});

test("lastmod follows imported content history, not embedded verification dates", () => {
  const f = fixture();
  const git = (args: string[], date = "2020-01-01T12:00:00Z") => execFileSync("git", ["-c", "user.name=Sitemap test", "-c", "user.email=sitemap@example.invalid", ...args], {
    cwd: f.directory, env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date }, stdio: "ignore"
  });
  try {
    git(["init"]);
    f.write("src/pages/example.astro", '---\nimport content from "@/data/example.json";\n---\n<h1>{content.title}</h1>');
    f.write("src/data/example.json", '{"title":"Original", "lastVerified":"2025-12-01"}');
    git(["add", "."]); git(["commit", "-m", "Initial page"]);
    assert.equal(contentModifiedDates(f.directory)(["src/pages/example.astro"]), "2020-01-01");
    f.write("src/data/example.json", '{"title":"Revised", "lastVerified":"2025-12-01"}');
    git(["add", "."]); git(["commit", "-m", "Revise content"], "2021-02-03T12:00:00Z");
    assert.equal(contentModifiedDates(f.directory)(["src/pages/example.astro"]), "2021-02-03");
    f.write("src/data/example.json", '{"title":"Local edit"}');
    assert.equal(contentModifiedDates(f.directory)(["src/pages/example.astro"]), new Date().toISOString().slice(0, 10));
  } finally { f.cleanup(); }
});

test("archives without history omit lastmod instead of using checkout time", () => {
  const f = fixture();
  try {
    f.write("src/pages/example.astro", "<h1>Example</h1>");
    assert.equal(contentModifiedDates(f.directory)(["src/pages/example.astro"]), undefined);
  } finally { f.cleanup(); }
});

test("noindex references remain accessible but cannot appear in the sitemap", () => {
  const f = fixture();
  try {
    f.write("index.html", '<link rel="canonical" href="https://example.com/">');
    f.write("sources/reference/index.html", '<meta name="robots" content="noindex, follow"><link rel="canonical" href="https://example.com/sources/reference/">');
    f.write("sitemap.xml", '<urlset><url><loc>https://example.com/</loc></url></urlset>');
    assert.deepEqual(validateSitemap(f.directory), { count: 1, failures: [] });
    f.write("sitemap.xml", '<urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/sources/reference/</loc></url></urlset>');
    assert.match(validateSitemap(f.directory).failures.join("\n"), /no indexable canonical HTML page.*sources\/reference/);
  } finally { f.cleanup(); }
});
