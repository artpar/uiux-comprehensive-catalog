import { useMemo, useState } from "react";

const items = ["Modal dialog", "Undo", "Faceted search", "Bottom navigation"];

export default function NoResultsRecoveryDemo() {
  const [query, setQuery] = useState("");
  const [onlyMobile, setOnlyMobile] = useState(false);

  const visible = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = item.toLowerCase().includes(query.toLowerCase());
      const matchesMobile = !onlyMobile || item === "Bottom navigation";
      return matchesQuery && matchesMobile;
    });
  }, [query, onlyMobile]);

  function recover() {
    setQuery("");
    setOnlyMobile(false);
  }

  function showNoResults() {
    setQuery("zzz");
    setOnlyMobile(true);
  }

  return (
    <div className="demo-surface">
      <div className="demo-row" role="group" aria-label="No-results scenarios">
        <button type="button" className="demo-button small" onClick={recover}>
          Normal results
        </button>
        <button type="button" className="demo-button small" onClick={showNoResults}>
          Zero-result state
        </button>
      </div>
      <div className="demo-filter-grid">
        <label>
          Search patterns
          <input name="no-results-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try zzz" />
        </label>
        <label className="checkbox-label">
          <input name="no-results-mobile-only" type="checkbox" checked={onlyMobile} onChange={(event) => setOnlyMobile(event.target.checked)} />
          Mobile only
        </label>
      </div>

      {visible.length > 0 ? (
        <>
          <p className="demo-status" aria-live="polite">{visible.length} matches</p>
          <ul className="demo-list">
            {visible.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </>
      ) : (
        <div className="demo-empty" role="status">
          <h3>No matching patterns</h3>
          <p>Your current search and filters exclude every result. Keep the query visible and offer recovery.</p>
          <button className="demo-button" onClick={recover}>Clear search and filters</button>
        </div>
      )}
    </div>
  );
}
