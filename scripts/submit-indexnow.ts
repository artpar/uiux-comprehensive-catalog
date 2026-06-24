import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const DEFAULT_ENDPOINT = "https://api.indexnow.org/indexnow";
const DEFAULT_HOST = "uxpatternsguide.com";
const DEFAULT_KEY = "6b6d174b-121b-4700-b396-bc978b97bf59";
const MAX_URLS_PER_REQUEST = 10000;

type Options = {
  sitemapPath: string;
  endpoint: string;
  host: string;
  key: string;
  keyLocation: string;
  dryRun: boolean;
};

function optionValue(name: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function extractSitemapUrls(xml: string, host: string): string[] {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => {
      try {
        return new URL(url).host === host;
      } catch {
        return false;
      }
    });

  return [...new Set(urls)].sort();
}

async function submitBatch(options: Options, urls: string[], batchIndex: number, batchCount: number) {
  const payload = {
    host: options.host,
    key: options.key,
    keyLocation: options.keyLocation,
    urlList: urls,
  };

  if (options.dryRun) {
    console.log(
      `[dry-run] batch ${batchIndex + 1}/${batchCount}: would submit ${urls.length} URLs to ${options.endpoint}`,
    );
    console.log(`[dry-run] first URL: ${urls[0]}`);
    console.log(`[dry-run] key file: ${options.keyLocation}`);
    return;
  }

  const response = await fetch(options.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (![200, 202].includes(response.status)) {
    const body = await response.text();
    throw new Error(
      `IndexNow batch ${batchIndex + 1}/${batchCount} failed with HTTP ${response.status}: ${body}`,
    );
  }

  console.log(`IndexNow batch ${batchIndex + 1}/${batchCount}: submitted ${urls.length} URLs (${response.status})`);
}

async function main() {
  const key = optionValue("--key", process.env.INDEXNOW_KEY ?? DEFAULT_KEY)!;
  const host = optionValue("--host", process.env.INDEXNOW_HOST ?? DEFAULT_HOST)!;
  const keyLocation =
    optionValue("--key-location", process.env.INDEXNOW_KEY_LOCATION) ?? `https://${host}/${basename(`${key}.txt`)}`;

  const options: Options = {
    sitemapPath: optionValue("--sitemap", "dist/sitemap.xml")!,
    endpoint: optionValue("--endpoint", process.env.INDEXNOW_ENDPOINT ?? DEFAULT_ENDPOINT)!,
    host,
    key,
    keyLocation,
    dryRun: hasFlag("--dry-run"),
  };

  const sitemap = options.sitemapPath.startsWith("https://")
    ? await fetch(options.sitemapPath).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Could not fetch ${options.sitemapPath}: HTTP ${response.status}`);
        }
        return response.text();
      })
    : await readFile(options.sitemapPath, "utf8");
  const urls = extractSitemapUrls(sitemap, options.host);

  if (urls.length === 0) {
    throw new Error(`No URLs for host ${options.host} found in ${options.sitemapPath}`);
  }

  const batches = chunk(urls, MAX_URLS_PER_REQUEST);
  console.log(`IndexNow: ${urls.length} URLs from ${options.sitemapPath} across ${batches.length} batch(es)`);

  for (const [index, batch] of batches.entries()) {
    await submitBatch(options, batch, index, batches.length);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
