import { useMemo, useState } from "react";

const results = [
  { name: "Modal dialog", category: "Disclosure", platform: "web", maturity: "standard" },
  { name: "Bottom navigation", category: "Navigation", platform: "mobile", maturity: "established" },
  { name: "Faceted search", category: "Search", platform: "web", maturity: "established" },
  { name: "Prompt suggestions", category: "AI", platform: "web", maturity: "emerging" },
  { name: "Undo", category: "Recovery", platform: "desktop", maturity: "established" }
];

const facetGroups = [
  { id: "platform", label: "Platform", values: ["web", "mobile", "desktop"] },
  { id: "category", label: "Category", values: ["Disclosure", "Navigation", "Search", "AI", "Recovery"] },
  { id: "maturity", label: "Maturity", values: ["standard", "established", "emerging"] }
] as const;

type FacetKey = (typeof facetGroups)[number]["id"];
type Facets = Record<FacetKey, string[]>;

const emptyFacets: Facets = {
  platform: [],
  category: [],
  maturity: []
};

function matches(item: (typeof results)[number], facets: Facets) {
  return facetGroups.every((group) => {
    const active = facets[group.id];
    return active.length === 0 || active.includes(item[group.id]);
  });
}

export default function FacetedSearchDemo() {
  const [facets, setFacets] = useState<Facets>(emptyFacets);

  const filtered = useMemo(() => results.filter((result) => matches(result, facets)), [facets]);
  const activeFilters = facetGroups.flatMap((group) =>
    facets[group.id].map((value) => ({
      groupId: group.id,
      label: `${group.label}: ${value}`,
      value
    }))
  );

  function toggleFacet(groupId: FacetKey, value: string) {
    setFacets((current) => {
      const active = current[groupId];
      const nextValues = active.includes(value) ? active.filter((item) => item !== value) : [...active, value];
      return { ...current, [groupId]: nextValues };
    });
  }

  function clearFacet(groupId: FacetKey, value: string) {
    setFacets((current) => ({
      ...current,
      [groupId]: current[groupId].filter((item) => item !== value)
    }));
  }

  function countIfApplied(groupId: FacetKey, value: string) {
    const next = {
      ...facets,
      [groupId]: facets[groupId].includes(value) ? facets[groupId] : [...facets[groupId], value]
    };
    return results.filter((result) => matches(result, next)).length;
  }

  return (
    <div className="demo-surface">
      <div className="facet-layout">
        <div className="facet-controls" aria-label="Facet filters">
          {facetGroups.map((group) => (
            <fieldset key={group.id} className="facet-group">
              <legend>{group.label}</legend>
              {group.values.map((value) => (
                <label key={value} className="facet-option">
                  <input
                    type="checkbox"
                    checked={facets[group.id].includes(value)}
                    onChange={() => toggleFacet(group.id, value)}
                  />
                  <span>{value}</span>
                  <small>{countIfApplied(group.id, value)}</small>
                </label>
              ))}
            </fieldset>
          ))}
        </div>

        <div className="facet-results">
          <div className="demo-chips" aria-label="Applied filters">
            {activeFilters.map((filter) => (
              <button key={filter.label} className="demo-chip" onClick={() => clearFacet(filter.groupId, filter.value)}>
                {filter.label} x
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button className="demo-button small" onClick={() => setFacets(emptyFacets)}>
                Clear all
              </button>
            )}
          </div>

          <p className="demo-status" aria-live="polite">
            {filtered.length} results
          </p>

          {filtered.length > 0 ? (
            <ul className="demo-list">
              {filtered.map((result) => (
                <li key={result.name}>
                  <span>{result.name}</span>
                  <small>
                    {result.category} / {result.platform} / {result.maturity}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <div className="demo-empty" role="status">
              <h3>No matching patterns</h3>
              <p>Keep the applied filters visible and offer a direct path back to broader results.</p>
              <button className="demo-button" onClick={() => setFacets(emptyFacets)}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
