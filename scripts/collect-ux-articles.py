#!/usr/bin/env python3
"""Collect a reproducible, source-linked UX article index without republishing articles.

Reads public sitemaps, respects robots.txt for article fetches, and stores page
metadata plus a small heading outline. No article body text is retained.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from collections import Counter
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "research" / "ux-article-corpus.jsonl"
REPORT = ROOT / "research" / "ux-article-crawl-report.json"
INDEX = ROOT / "research" / "ux-sitemap-index.jsonl"
USER_AGENT = "UXPatternsGuideResearch/1.0 (+https://uxpatternsguide.com)"
FETCH_HEADERS = {"User-Agent": USER_AGENT, "Accept": "text/html,application/xml;q=0.9,*/*;q=0.5"}

# Deliberately broad: original research publications, practitioner blogs,
# accessibility groups, and public-sector design teams.
PUBLISHERS = [
    ("Nielsen Norman Group", "https://www.nngroup.com/sitemap.xml", r"/articles/[^/]+/?$"),
    ("Baymard Institute", "https://baymard.com/sitemap.xml", r"/(research-articles|blog)/[^/]+/?$"),
    ("Smashing Magazine", "https://www.smashingmagazine.com/sitemap.xml", r"/20\d\d/\d\d/[^/]+/?$"),
    ("UXmatters", "https://www.uxmatters.com/sitemap.xml", r"/mt/archives/20\d\d/\d\d/[^/]+\.php$"),
    ("A List Apart", "https://alistapart.com/sitemap-1.xml", r"/blog/post/[^/]+/?$"),
    ("Boxes and Arrows", "https://boxesandarrows.com/post-sitemap.xml", r"^/[^/.]+/?$"),
    ("Microsoft Design", "https://microsoft.design/post-sitemap.xml", r"/articles/[^/]+/?$"),
    ("Google Design", "https://design.google/sitemap.xml", r"/library/[^/]+/?$"),
    ("Digital.gov", "https://digital.gov/sitemap.xml", r"/20\d\d/\d\d/\d\d/[^/]+/?$"),
    ("W3C WAI", "https://www.w3.org/WAI/sitemap.xml", r"/WAI/(fundamentals|people-use-web|planning|tutorials|test-evaluate)/.+"),
    ("dscout People Nerds", "https://dscout.com/sitemap.xml", r"/people-nerds/[^/]+/?$"),
    ("Optimal Workshop", "https://www.optimalworkshop.com/sitemap.xml", r"/blog/[^/]+/?$"),
    ("Designlab", "https://designlab.com/sitemap.xml", r"/blog/[^/]+/?$"),
    ("Content Design London", "https://contentdesign.london/sitemap.xml", r"/blog/[^/]+/?$"),
    ("Usability Geek", "https://usabilitygeek.com/post-sitemap.xml", r"^/[^/.]+/?$"),
    ("MeasuringU", "https://measuringu.com/wp-sitemap-posts-post-1.xml", r"^/[^/.]+/?$"),
    ("UX Movement", "https://uxmovement.com/sitemap.xml", r"^/[^/]+/[^/]+/?$"),
    ("UX Mastery", "https://uxmastery.com/post-sitemap.xml", r"^/[^/.]+/?$"),
    ("UXPA", "https://uxpa.org/post-sitemap.xml", r"^/[^/.]+/?$"),
    ("UX Design Institute", "https://www.uxdesigninstitute.com/sitemap.xml", r"/blog/[^/]+/?$"),
]

TOPICS = {
    "foundations": r"experience|usability|human.centered|mental.model|design.principle|inclusive|accessib",
    "research": r"research|interview|observ|discovery|user.need|field.stud|survey|ethnograph",
    "framing": r"problem|hypothes|insight|synthes|triangulat|bias|evidence|persona",
    "interaction": r"journey|flow|interaction|pattern|content.design|(?:^|[-_/])forms?(?:[-_/]|$)|error|navigation|information.architecture",
    "evaluation": r"(?:^|[-_/])test(?:s|ing)?(?:[-_/]|$)|evaluat|prototype|metric|measure|experiment|iterat",
    "practice": r"service.design|blueprint|stakeholder|decision|collaborat|workshop|design.system",
}
TOPIC_PATTERNS = {name: re.compile(pattern, re.I) for name, pattern in TOPICS.items()}
EXCLUDE = re.compile(r"/tag/|/category/|/author/|/authors/|/feed/?$|/page/\d|\.(jpg|jpeg|png|gif|webp|pdf)$", re.I)


def fetch(url: str, limit: int = 2_000_000) -> tuple[bytes, str]:
    with urlopen(Request(url, headers=FETCH_HEADERS), timeout=18) as response:
        content_type = response.headers.get("Content-Type", "")
        return response.read(limit), content_type


def sitemap_urls(url: str) -> list[str]:
    payload, _ = fetch(url, 8_000_000)
    root = ElementTree.fromstring(payload)
    return [node.text.strip() for node in root.iter() if node.tag.endswith("loc") and node.text]


def topic_tags(url: str) -> list[str]:
    slug = urlparse(url).path.replace("-", "_")
    return [name for name, pattern in TOPIC_PATTERNS.items() if pattern.search(slug)]


def select_urls(urls: list[str], article_pattern: str, maximum: int) -> list[str]:
    pattern = re.compile(article_pattern, re.I)
    candidates = [url for url in urls if pattern.search(urlparse(url).path) and not EXCLUDE.search(urlparse(url).path)]
    candidates = [url for url in candidates if topic_tags(url)]
    selected: list[str] = []
    # Round-robin across course topics to avoid collecting only one subfield.
    for topic in TOPICS:
        matches = [url for url in candidates if topic in topic_tags(url)]
        matches.sort(key=lambda url: (-len(topic_tags(url)), len(urlparse(url).path), url))
        for url in matches[:2]:
            if url not in selected:
                selected.append(url)
    for url in sorted(candidates, key=lambda url: (-len(topic_tags(url)), len(urlparse(url).path), url)):
        if len(selected) >= maximum:
            break
        if url not in selected:
            selected.append(url)
    return selected[:maximum]


class ArticleParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.meta: dict[str, str] = {}
        self.canonical = ""
        self.title = ""
        self.h1 = ""
        self.heading_candidates: list[tuple[int, str]] = []
        self.capture = ""
        self.buffer: list[str] = []
        self.stack: list[str] = []
        self.json_ld: list[str] = []

    @property
    def headings(self) -> list[str]:
        noise = re.compile(r"^(cookies|navigation|search|menu|related|subscribe|live online|self-paced|contents|share|footer)", re.I)
        for level in (2, 1, 0):
            values = [value for context, value in self.heading_candidates if context == level and not noise.search(value)]
            if values:
                return list(dict.fromkeys(values))[:8]
        return []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "meta":
            key = (values.get("property") or values.get("name") or "").lower()
            if key and values.get("content"):
                self.meta.setdefault(key, values["content"].strip())
        elif tag == "link" and "canonical" in (values.get("rel") or ""):
            self.canonical = values.get("href") or ""
        elif tag in ("title", "h1", "h2", "h3") and not self.capture:
            self.capture = tag
            self.buffer = []
        elif tag == "script" and values.get("type", "").lower() == "application/ld+json" and not self.capture:
            self.capture = "jsonld"
            self.buffer = []
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append(tag)

    def handle_data(self, data: str) -> None:
        if self.capture:
            self.buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == self.capture or (tag == "script" and self.capture == "jsonld"):
            value = "".join(self.buffer) if tag == "script" else " ".join(" ".join(self.buffer).split())
            if value:
                if tag == "title":
                    self.title = value
                elif tag == "h1" and not self.h1:
                    self.h1 = value
                elif tag in ("h2", "h3"):
                    context = 2 if "article" in self.stack else 1 if "main" in self.stack else 0
                    self.heading_candidates.append((context, value[:120]))
                elif tag == "script":
                    self.json_ld.append(value)
            self.capture = ""
            self.buffer = []
        if tag in self.stack:
            self.stack = self.stack[: len(self.stack) - 1 - self.stack[::-1].index(tag)]

    def structured_metadata(self) -> dict[str, str]:
        output: dict[str, str] = {}

        def walk(value: object) -> None:
            if isinstance(value, list):
                for item in value:
                    walk(item)
            elif isinstance(value, dict):
                types = value.get("@type", "")
                if isinstance(types, list):
                    types = " ".join(str(x) for x in types)
                if any(word in str(types).lower() for word in ("article", "blogposting", "report", "webpage")):
                    if value.get("datePublished") and not output.get("date"):
                        output["date"] = str(value["datePublished"])
                    author = value.get("author")
                    if isinstance(author, list):
                        author = author[0] if author else None
                    if isinstance(author, dict):
                        author = author.get("name")
                    if isinstance(author, str) and author and not output.get("author"):
                        output["author"] = author
                for nested in value.values():
                    if isinstance(nested, (dict, list)):
                        walk(nested)

        for block in self.json_ld:
            try:
                walk(json.loads(block))
            except (ValueError, TypeError):
                continue
        return output


def article_record(publisher: str, url: str, robots: RobotFileParser) -> dict:
    if not robots.can_fetch(USER_AGENT, url):
        raise PermissionError("robots.txt disallows article fetch")
    payload, content_type = fetch(url)
    if "html" not in content_type.lower() and not payload.lstrip().startswith(b"<!DOCTYPE html"):
        raise ValueError(f"not HTML: {content_type}")
    parser = ArticleParser()
    parser.feed(payload.decode("utf-8", "replace"))
    meta = parser.meta
    structured = parser.structured_metadata()
    title = meta.get("og:title") or parser.h1 or parser.title
    if not title:
        raise ValueError("no title")
    description = meta.get("description") or meta.get("og:description") or ""
    # Short source-authored snippet for screening; the article itself stays at its URL.
    description = " ".join(description.split())[:240]
    date = meta.get("article:published_time") or meta.get("date") or meta.get("dc.date") or structured.get("date") or ""
    author = meta.get("author") or meta.get("article:author") or structured.get("author") or ""
    return {
        "publisher": publisher,
        "url": parser.canonical or url,
        "title": title[:220],
        "author": author[:120],
        "published": date[:40],
        "description": description,
        "headings": parser.headings,
        "topics": topic_tags(url),
        "scrapedFrom": url,
    }


def main() -> int:
    argp = argparse.ArgumentParser()
    argp.add_argument("--max-per-publisher", type=int, default=10)
    argp.add_argument("--delay", type=float, default=0.35, help="seconds between article requests")
    argp.add_argument("--seed-only", action="store_true", help="append the curated course readings to an existing crawl")
    argp.add_argument("--append", action="store_true", help="keep existing records and crawl additional publishers")
    argp.add_argument("--only", nargs="*", help="crawl only publishers with these exact names")
    argp.add_argument("--refresh-existing", action="store_true", help="refresh metadata for URLs already in the corpus")
    argp.add_argument("--index-only", action="store_true", help="write all course-relevant URLs in publisher sitemaps, without fetching articles")
    args = argp.parse_args()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    if args.index_only:
        index_rows: list[dict] = []
        for publisher, sitemap, article_pattern in PUBLISHERS:
            try:
                urls = sitemap_urls(sitemap)
                pattern = re.compile(article_pattern, re.I)
                matches = [url for url in urls if pattern.search(urlparse(url).path) and not EXCLUDE.search(urlparse(url).path) and topic_tags(url)]
                index_rows.extend({"publisher": publisher, "url": url, "topics": topic_tags(url)} for url in matches)
                print(f"{publisher}: {len(matches)} topical article URLs", flush=True)
            except (HTTPError, URLError, ElementTree.ParseError, TimeoutError, ValueError) as exc:
                print(f"{publisher}: sitemap unavailable: {exc}", file=sys.stderr, flush=True)
        index_rows.sort(key=lambda row: (row["publisher"], row["url"]))
        INDEX.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in index_rows))
        print(f"Wrote {len(index_rows)} URL records to {INDEX.relative_to(ROOT)}", flush=True)
        return 0 if index_rows else 1
    if (args.seed_only or args.append or args.refresh_existing) and OUTPUT.exists():
        records = [json.loads(line) for line in OUTPUT.read_text().splitlines() if line.strip()]
        old_report = json.loads(REPORT.read_text()) if REPORT.exists() else {}
        failures = old_report.get("failures", [])
    else:
        records = []
        failures = []
    counts: Counter[str] = Counter(record["publisher"] for record in records)
    if args.refresh_existing:
        refreshed: list[dict] = []
        robots_cache: dict[str, RobotFileParser] = {}
        for old in records:
            url = old.get("scrapedFrom") or old["url"]
            origin = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
            if origin not in robots_cache:
                robots_cache[origin] = RobotFileParser(origin + "/robots.txt")
                robots_cache[origin].read()
            try:
                updated = article_record(old["publisher"], url, robots_cache[origin])
                if old.get("courseSeed"):
                    updated["courseSeed"] = True
                refreshed.append(updated)
            except (PermissionError, HTTPError, URLError, TimeoutError, ValueError) as exc:
                failures.append({"publisher": old["publisher"], "stage": "refresh", "url": url, "error": str(exc)[:180]})
                refreshed.append(old)
            time.sleep(args.delay)
        records = refreshed
        print(f"Refreshed {len(records)} existing records", flush=True)
    selected_publishers = [] if (args.seed_only or args.refresh_existing) else [p for p in PUBLISHERS if not args.only or p[0] in args.only]
    for publisher, sitemap, article_pattern in selected_publishers:
        try:
            candidates = select_urls(sitemap_urls(sitemap), article_pattern, args.max_per_publisher)
        except (HTTPError, URLError, ElementTree.ParseError, TimeoutError, ValueError) as exc:
            failures.append({"publisher": publisher, "stage": "sitemap", "error": str(exc)[:180]})
            print(f"{publisher}: sitemap unavailable: {exc}", file=sys.stderr, flush=True)
            continue
        robot_url = f"{urlparse(sitemap).scheme}://{urlparse(sitemap).netloc}/robots.txt"
        robots = RobotFileParser(robot_url)
        try:
            robots.read()
        except Exception:
            failures.append({"publisher": publisher, "stage": "robots", "error": "robots.txt unavailable; publisher skipped"})
            continue
        for url in candidates:
            try:
                record = article_record(publisher, url, robots)
                if record["url"].rstrip("/") not in {row["url"].rstrip("/") for row in records}:
                    records.append(record)
                    counts[publisher] += 1
            except (PermissionError, HTTPError, URLError, TimeoutError, ValueError) as exc:
                failures.append({"publisher": publisher, "stage": "article", "url": url, "error": str(exc)[:180]})
            time.sleep(args.delay)
        print(f"{publisher}: {counts[publisher]}/{len(candidates)} articles", flush=True)
    research_map = json.loads((ROOT / "src" / "data" / "course-research.json").read_text())
    seen = {record["url"].rstrip("/") for record in records}
    robots_cache: dict[str, RobotFileParser] = {}
    for source in research_map["sources"].values():
        url = source["url"]
        if url.rstrip("/") in seen:
            continue
        origin = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
        if origin not in robots_cache:
            robots_cache[origin] = RobotFileParser(origin + "/robots.txt")
            robots_cache[origin].read()
        try:
            record = article_record(source["publisher"], url, robots_cache[origin])
            record["courseSeed"] = True
            records.append(record)
            seen.add(record["url"].rstrip("/"))
            counts[record["publisher"]] += 1
        except (PermissionError, HTTPError, URLError, TimeoutError, ValueError) as exc:
            failures.append({"publisher": source["publisher"], "stage": "course-seed", "url": url, "error": str(exc)[:180]})
        time.sleep(args.delay)
    records.sort(key=lambda row: (row["publisher"], row["title"].lower()))
    OUTPUT.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in records))
    report = {
        "collectedAt": datetime.now(timezone.utc).isoformat(),
        "scope": "Selected public UX articles from named publisher indexes plus curated course readings; not every UX blog on the internet.",
        "method": "Sitemap discovery, topic-balanced URL selection, robots.txt check, HTML metadata and heading extraction. No full article body text stored.",
        "records": len(records),
        "publishers": dict(sorted(counts.items())),
        "failures": failures,
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(records)} records to {OUTPUT.relative_to(ROOT)}", flush=True)
    return 0 if records else 1


if __name__ == "__main__":
    raise SystemExit(main())
