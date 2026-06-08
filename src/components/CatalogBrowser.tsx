import { useMemo, useState } from "react";
import type { PatternEntry } from "@/schemas/catalog";

type CatalogBrowserProps = {
  patterns: PatternEntry[];
  categories: string[];
  platforms: string[];
  maturities: string[];
  baseUrl: string;
};

function matchesText(pattern: PatternEntry, query: string) {
  const text = [
    pattern.name,
    pattern.aliases.join(" "),
    pattern.category,
    pattern.problem,
    pattern.solution,
    pattern.useWhen.join(" "),
    pattern.avoidWhen.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(query.toLowerCase());
}

export default function CatalogBrowser({
  patterns,
  categories,
  platforms,
  maturities,
  baseUrl
}: CatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [maturity, setMaturity] = useState("all");
  const [showAntiPatterns, setShowAntiPatterns] = useState(true);

  const filtered = useMemo(() => {
    return patterns.filter((pattern) => {
      if (!showAntiPatterns && pattern.maturity === "anti-pattern") return false;
      if (category !== "all" && pattern.category !== category) return false;
      if (platform !== "all" && !pattern.platforms.some((item) => item === platform)) return false;
      if (maturity !== "all" && pattern.maturity !== maturity) return false;
      if (query.trim() && !matchesText(pattern, query.trim())) return false;
      return true;
    });
  }, [patterns, query, category, platform, maturity, showAntiPatterns]);

  return (
    <section className="catalog-shell" aria-label="Pattern catalog">
      <div className="filters" aria-label="Catalog filters">
        <label>
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patterns, problems, aliases"
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Platform
          <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
            <option value="all">All platforms</option>
            {platforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Maturity
          <select value={maturity} onChange={(event) => setMaturity(event.target.value)}>
            <option value="all">All maturity levels</option>
            {maturities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showAntiPatterns}
            onChange={(event) => setShowAntiPatterns(event.target.checked)}
          />
          Include anti-patterns
        </label>
      </div>

      <div className="result-count" aria-live="polite">
        {filtered.length} patterns
      </div>

      <div className="pattern-grid">
        {filtered.map((pattern) => (
          <article key={pattern.id} className="pattern-card">
            <div className="card-meta">
              <span>{pattern.category}</span>
              <span>{pattern.maturity}</span>
            </div>
            <h2>
              <a href={`${baseUrl}patterns/${pattern.id}/`}>{pattern.name}</a>
            </h2>
            <p>{pattern.problem}</p>
            <div className="card-tags">
              {pattern.platforms.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
