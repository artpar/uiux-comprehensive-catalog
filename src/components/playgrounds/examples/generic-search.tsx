import { useEffect, useRef, useState } from "react";
import { QualityPanel, short, type PatternMeta } from './shared';

function SearchUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (!good) {
    if (patternId === "browse-by-category") {
      return (
        <div className="bad-ui-sample browse-category-bad-ui">
          {["CX Ops", "Services", "Info", "Other"].map((item) => (
            <span key={item}>{item}</span>
          ))}
          <div className="browse-category-bad-panel">
            <strong>0 items</strong>
            <span>Internal labels, overlapping meaning, and no route out of the empty category.</span>
          </div>
        </div>
      );
    }

    if (patternId === "advanced-search") {
      return (
        <div className="bad-ui-sample advanced-search-bad-ui">
          <input aria-label="Unvalidated advanced query" defaultValue={'status=open title:"appeal'} />
          <button type="button" className="demo-button small">Run</button>
          <div className="advanced-search-bad-panel">
            <strong>0 results</strong>
            <span>Unmatched quote is treated as no matches; no field, operator, or repair path.</span>
          </div>
        </div>
      );
    }

    if (patternId === "query-correction") {
      return (
        <div className="bad-ui-sample query-correction-bad-ui">
          <input aria-label="Silently rewritten search" defaultValue="benefit appeal" />
          <button type="button" className="demo-button small">Go</button>
          <div className="query-correction-bad-panel">
            <strong>22 results</strong>
            <span>Original benifit appeel was replaced; no changed terms or search-original path.</span>
          </div>
        </div>
      );
    }

    if (patternId === "recommendations") {
      return (
        <div className="bad-ui-sample recommendations-bad-ui">
          <div className="recommendations-bad-card">
            <strong>You will love this</strong>
            <span>Sponsored item hidden inside the same list.</span>
          </div>
          <div className="recommendations-bad-card">
            <strong>Recently viewed?</strong>
            <span>User never opened this item; no reason or dismissal.</span>
          </div>
          <div className="recommendations-bad-panel">
            <strong>8 more like this</strong>
            <span>No source, no feedback control, and unavailable items still rank first.</span>
          </div>
        </div>
      );
    }

    if (patternId === "recently-searched") {
      return (
        <div className="bad-ui-sample recent-searches-bad-ui">
          <div className="recent-search-list bad">
            <strong>Recent</strong>
            {["Sponsored claim help", "Atlas Packaging", "Saved: Open cases", "another user's health search"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p className="demo-status">Ads, viewed records, saved searches, and another user's query are mixed under one vague label.</p>
        </div>
      );
    }

    if (patternId === "search-history") {
      return (
        <div className="bad-ui-sample search-history-bad-ui">
          <div className="search-history-bad-panel">
            <strong>History</strong>
            {["Saved: open cases", "Viewed file: debt.pdf", "Sponsored claim help", "shared kiosk health search"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <button type="button" className="demo-button small danger">Clear all</button>
          <p className="demo-status">One destructive button mixes saved searches, viewed files, ads, and another user's query.</p>
        </div>
      );
    }

    if (patternId === "typeahead") {
      return (
        <div className="bad-ui-sample typeahead-bad-ui">
          <input aria-label="Typeahead with stale result" defaultValue="case" />
          <div className="typeahead-bad-panel">
            <strong>Case 104 auto-filled</strong>
            <span>Old ca response replaced typed text; no loading, query label, or stale guard.</span>
          </div>
          <p className="demo-status">The first result looks committed before the user chooses it.</p>
        </div>
      );
    }

    if (patternId === "combobox") {
      return (
        <div className="bad-ui-sample combobox-bad-ui">
          <label>
            <span>{meta.field}</span>
            <input aria-label="Assignee text with stale hidden ID" defaultValue="Aditi" />
          </label>
          <div className="combobox-popup bad" aria-hidden="true">
            <div>Aditi Rao</div>
            <div>Ada Lovelace</div>
          </div>
          <div className="combobox-hidden-value">hidden assignee_id: ada-lovelace</div>
          <p className="demo-status">Visual text, popup state, and submitted ID are not synchronized.</p>
        </div>
      );
    }

    if (patternId === "search-scope-selector") {
      return (
        <div className="bad-ui-sample search-scope-bad-ui">
          <input aria-label="Search without visible scope" defaultValue="appeal" />
          <button type="button" className="demo-button small">Search</button>
          <div className="search-scope-bad-panel">
            <strong>14 results</strong>
            <span>Scope hidden in vanished placeholder; stale All spaces label remains.</span>
          </div>
        </div>
      );
    }

    if (patternId === "search-result-highlighting") {
      return (
        <div className="bad-ui-sample search-highlight-bad-ui">
          <div className="search-highlight-bad-card">
            <strong>Everything looks important</strong>
            <span>The whole card is tinted, but no matching term or field is identified.</span>
          </div>
          <div className="search-highlight-bad-card stale">
            <strong>Old query: renewal</strong>
            <span>Stale highlights remain after the query changed to benefits appeal.</span>
          </div>
        </div>
      );
    }

    if (patternId === "saved-filter") {
      return (
        <div className="bad-ui-sample saved-filter-bad-ui">
          <button type="button" className="saved-filter-save-bad">Save</button>
          <div className="saved-filter-list bad" aria-label="Ambiguous saved filters">
            {["Mine", "Old", "Team"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="saved-filter-panel bad">
            <strong>14 rows saved</strong>
            <span>No criteria, owner, visibility, or query/sort boundary.</span>
          </div>
        </div>
      );
    }

    if (patternId === "saved-search") {
      return (
        <div className="bad-ui-sample saved-search-bad-ui">
          <button type="button" className="saved-search-star" aria-label="Unnamed saved search">★</button>
          <div className="saved-search-list bad" aria-label="Mixed saved items">
            {["Saved", "Recent", "Filter 1"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="saved-search-panel bad">
            <strong>3 rows saved</strong>
            <span>No query, owner, visibility, or dynamic rerun state.</span>
          </div>
        </div>
      );
    }

    if (patternId === "sort-controls") {
      return (
        <div className="bad-ui-sample sort-controls-bad-ui">
          <label>
            <span>Sort</span>
            <select defaultValue="mixed">
              <option value="mixed">Newest</option>
              <option>Open cases</option>
              <option>Last 30 days</option>
              <option>A-Z</option>
            </select>
          </label>
          <div className="sort-result-panel bad">
            <strong>Page 2 sorted only</strong>
            <span>Filter values are mixed into the sort menu.</span>
          </div>
        </div>
      );
    }

    if (patternId === "filter-chips") {
      return (
        <div className="bad-ui-sample filter-chips-bad-ui">
          <div className="filter-chip-row bad" aria-label="Ambiguous filter chips">
            {["1", "New", "Hot", "More"].map((item) => (
              <span key={item} className="filter-chip-bad-pill">{item}</span>
            ))}
          </div>
          <div className="filter-chip-result-panel bad">
            <strong>42 records</strong>
            <span>Chip labels do not say what result filter is active.</span>
          </div>
        </div>
      );
    }

    if (patternId === "filter-reset-that-clears-unrelated-search") return <FilterResetSearchBadUi />;

    if (patternId === "filter-panel") {
      return (
        <div className="bad-ui-sample filter-panel-bad-ui">
          <button type="button" className="filter-panel-trigger bad">Filters</button>
          <div className="filter-panel-shell bad">
            <div className="filter-panel-body bad">
              {["status", "dept", "date", "x"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="filter-panel-results bad">
              <strong>42 records</strong>
              <span>No visible active filters or result-state summary.</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bad-ui-sample">
        <input aria-label={`${meta.field} cramped`} placeholder={patternId === "command-palette" ? "cmd" : "?"} />
        <div className="bad-result-stack">
          {meta.options.slice(0, 3).map((item) => <span key={item}>{short(item)}</span>)}
        </div>
      </div>
    );
  }

  if (patternId === "browse-by-category") {
    return (
      <div className="quality-example browse-category-demo">
        <div className="browse-category-grid preview">
          {[
            ["Benefits", "Eligibility, appeals, Universal Credit", "24 services"],
            ["Housing", "Renting, council services, repairs", "17 services"],
            ["Money and tax", "Debt, Self Assessment, VAT", "31 services"]
          ].map(([title, description, count]) => (
            <article className="browse-category-card" key={title}>
              <strong>{title}</strong>
              <span>{description}</span>
              <small>{count}</small>
            </article>
          ))}
        </div>
        <div className="browse-category-location">
          <span>Services and information</span>
          <strong>Benefits</strong>
        </div>
      </div>
    );
  }

  if (patternId === "recommendations") {
    return (
      <div className="quality-example recommendations-demo">
        <div className="recommendations-header">
          <span>Recommended for you</span>
          <strong>Based on saved benefits work</strong>
        </div>
        <div className="recommendations-list preview">
          {[
            ["Appeal a benefit decision", "Because you saved appeals guidance", "Service"],
            ["Upload evidence", "Next common step after an appeal", "Task"],
            ["Debt advice appointment", "Popular with benefits caseworkers", "Support"]
          ].map(([title, reason, type]) => (
            <article className="recommendation-card" key={title}>
              <span>{type}</span>
              <strong>{title}</strong>
              <small>{reason}</small>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "advanced-search") {
    return (
      <div className="quality-example advanced-search-demo">
        <div className="advanced-search-builder-preview">
          <div className="advanced-search-clause-preview">
            <span>Where</span>
            <strong>Status = Open</strong>
          </div>
          <div className="advanced-search-joiner">AND</div>
          <div className="advanced-search-clause-preview">
            <span>And</span>
            <strong>Title contains appeal</strong>
          </div>
        </div>
        <div className="advanced-search-query-preview">
          <span>Generated query</span>
          <code>status:open AND title:"appeal"</code>
        </div>
        <div className="advanced-search-count-preview">
          <strong>18 preview matches</strong>
          <span>Ready to search; syntax and field/operator pairs are valid.</span>
        </div>
      </div>
    );
  }

  if (patternId === "query-correction") {
    return (
      <div className="quality-example query-correction-demo">
        <label>
          <span>{meta.field}</span>
          <input value="benifit appeel" readOnly />
        </label>
        <div className="query-correction-banner" role="status">
          <span>Showing results for</span>
          <strong><mark>benefit</mark> <mark>appeal</mark></strong>
          <button type="button" className="demo-button small">Search instead for benifit appeel</button>
        </div>
        <div className="query-correction-result-panel">
          <strong>22 corrected results</strong>
          <span>2 changed tokens; original query preserved.</span>
        </div>
      </div>
    );
  }

  if (patternId === "search-scope-selector") {
    return (
      <div className="quality-example search-scope-demo">
        <div className="search-scope-form-preview">
          <div className="search-scope-query">
            <span>Query</span>
            <strong>appeal</strong>
          </div>
          <div className="search-scope-segments" aria-label="Search scope preview">
            <button type="button" className="is-active">Current workspace</button>
            <button type="button">All knowledge</button>
            <button type="button">Cases</button>
          </div>
        </div>
        <div className="search-scope-summary">
          <strong>Results for appeal in Current workspace</strong>
          <span>12 results; broaden to All knowledge for 38 results.</span>
        </div>
      </div>
    );
  }

  if (patternId === "search-result-highlighting") {
    return (
      <div className="quality-example search-highlight-demo">
        <div className="search-highlight-query-bar">
          <div className="search-highlight-query">
            <span>Submitted query</span>
            <strong>benefits appeal</strong>
          </div>
          <span className="search-highlight-count">4 highlighted fragments</span>
        </div>
        <div className="search-highlight-results compact">
          <article className="search-highlight-result">
            <span>Title match</span>
            <strong><mark>Benefits</mark> <mark>appeal</mark> policy</strong>
            <p>... submit an <mark>appeal</mark> within 30 days of the <mark>benefits</mark> notice ...</p>
          </article>
          <article className="search-highlight-result">
            <span>Snippet match</span>
            <strong>Deadline guide</strong>
            <p>... request review before the <mark>appeal</mark> deadline expires ...</p>
          </article>
        </div>
      </div>
    );
  }

  if (patternId === "saved-filter") {
    return (
      <div className="quality-example saved-filter-demo">
        <div className="saved-filter-toolbar">
          <div className="saved-filter-context">
            <span>Query preserved</span>
            <strong>appeal</strong>
          </div>
          <div className="saved-filter-context">
            <span>Sort preserved</span>
            <strong>Newest</strong>
          </div>
          <button type="button" className="saved-filter-save-button">Save filter</button>
        </div>
        <div className="saved-filter-layout">
          <aside className="saved-filter-list" aria-label="Saved filters preview">
            <button type="button" className="is-active">High priority benefits</button>
            <button type="button">My review queue</button>
          </aside>
          <section className="saved-filter-panel" aria-label="Saved filter preview">
            <strong>High priority benefits</strong>
            <div className="saved-filter-chip-row">
              <span>Status: Open</span>
              <span>Team: Benefits</span>
              <span>Priority: High</span>
            </div>
            <small>9 current matches; query and sort are not part of this preset.</small>
          </section>
        </div>
      </div>
    );
  }

  if (patternId === "saved-search") {
    return (
      <div className="quality-example saved-search-demo">
        <div className="saved-search-toolbar">
          <div className="saved-search-criteria">
            <span>Query</span>
            <strong>owner:me renewal</strong>
          </div>
          <button type="button" className="saved-search-save-button">Save search</button>
        </div>
        <div className="saved-search-layout">
          <aside className="saved-search-list" aria-label="Saved searches preview">
            <button type="button" className="is-active">★ Renewal risk</button>
            <button type="button">My blocked reviews</button>
          </aside>
          <section className="saved-search-panel" aria-label="Saved search preview">
            <strong>Renewal risk</strong>
            <span>Private - Open only - Updated newest</span>
            <small>14 current matches, rerun from criteria</small>
          </section>
        </div>
      </div>
    );
  }

  if (patternId === "sort-controls") {
    return (
      <div className="quality-example sort-controls-demo">
        <div className="sort-controls-toolbar">
          <label>
            <span>Sort by</span>
            <select defaultValue="due-asc">
              <option value="due-asc">Due date (oldest first)</option>
            </select>
          </label>
          <span className="sort-order-badge">Whole result set</span>
        </div>
        <table className="sort-demo-table">
          <thead>
            <tr>
              <th scope="col">Case</th>
              <th scope="col" aria-sort="ascending">Due date ↑</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Case 221</td><td>Jan 12</td><td>$900</td></tr>
            <tr><td>Case 104</td><td>Feb 20</td><td>$1,400</td></tr>
            <tr><td>Case 318</td><td>Mar 02</td><td>$700</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (patternId === "filter-reset-that-clears-unrelated-search") return <FilterResetSearchGoodUi />;

  if (patternId === "filter-panel") {
    return (
      <div className="quality-example filter-panel-demo">
        <div className="filter-panel-shell">
          <aside className="filter-panel-body" aria-label="Filters preview">
            <div className="filter-panel-heading">
              <strong>Filters</strong>
              <span>2 active</span>
            </div>
            <span className="filter-panel-category">Status</span>
            <span className="filter-panel-option is-selected">Open</span>
            <span className="filter-panel-category">Date</span>
            <span className="filter-panel-option is-selected">Last 30 days</span>
          </aside>
          <section className="filter-panel-results" aria-label="Filtered case results">
            <div className="filter-panel-summary">
              <strong>3 cases found</strong>
              <span>Open + Last 30 days</span>
            </div>
            <button type="button" className="filter-panel-chip">Status: Open x</button>
            <button type="button" className="filter-panel-chip">Date: Last 30 days x</button>
          </section>
        </div>
      </div>
    );
  }

  if (patternId === "filter-chips") {
    return (
      <div className="quality-example filter-chips-demo">
        <div className="filter-chip-search-preview">
          <span>Search query</span>
          <strong>case</strong>
        </div>
        <div className="filter-chip-row" aria-label="Quick filter chips preview">
          {["Open", "Urgent", "Appeal", "Benefits"].map((item, index) => (
            <button type="button" className={index < 2 ? "filter-chip is-selected" : "filter-chip"} aria-pressed={index < 2} key={item}>
              {index < 2 ? "✓ " : ""}{item}
            </button>
          ))}
        </div>
        <div className="filter-chip-result-panel">
          <strong>2 cases found</strong>
          <span>Open + Urgent filters are active and removable.</span>
        </div>
      </div>
    );
  }

  if (patternId === "faceted-search") {
    return (
      <div className="quality-example">
        <div className="facet-preview">
          <strong>Filters</strong>
          <span>Platform</span>
          <span>Maturity</span>
        </div>
        <div className="result-preview">
          <span>4 results</span>
          <strong>Faceted search</strong>
          <small>Search / web / established</small>
        </div>
      </div>
    );
  }

  if (patternId === "command-palette") {
    return (
      <div className="command-preview">
        <div className="command-preview-bar">
          <strong>Quick actions</strong>
          <kbd>Ctrl K</kbd>
        </div>
        <label>
          <span>{meta.field}</span>
          <input value="open" readOnly aria-controls="command-preview-options" />
        </label>
        <div className="command-scope">Scope: Workspace admin</div>
        <div className="mini-result-list" id="command-preview-options" role="listbox" aria-label="Command results preview">
          <button className="pattern-row is-selected command-row" type="button" role="option" aria-selected="true">
            <span>Open billing</span>
            <small>Navigate</small>
          </button>
          <button className="pattern-row command-row" type="button" role="option" aria-selected="false">
            <span>Open audit logs</span>
            <small>View</small>
          </button>
          <button className="pattern-row command-row danger-row" type="button" role="option" aria-selected="false">
            <span>Delete workspace...</span>
            <small>Needs confirmation</small>
          </button>
        </div>
      </div>
    );
  }

  if (patternId === "autocomplete") {
    return (
      <div className="quality-example">
        <label>
          <span>{meta.field}</span>
          <input value="Ada" readOnly aria-expanded="true" aria-controls="autocomplete-preview-options" />
        </label>
        <div className="mini-result-list" role="listbox" id="autocomplete-preview-options" aria-label="Known customer options">
          <button type="button" className="pattern-row is-selected">Ada Lovelace</button>
          <button type="button" className="pattern-row">Aditi Rao</button>
          <button type="button" className="pattern-row">Adam Chen</button>
        </div>
        <p className="demo-status">Selected value: Ada Lovelace</p>
      </div>
    );
  }

  if (patternId === "combobox") {
    return (
      <div className="quality-example combobox-demo">
        <label className="combobox-field">
          <span>{meta.field}</span>
          <div className="combobox-input-row">
            <input
              role="combobox"
              value="Adi"
              readOnly
              aria-expanded="true"
              aria-controls="combobox-preview-options"
              aria-autocomplete="list"
              aria-activedescendant="combobox-preview-aditi"
            />
            <button type="button" className="combobox-toggle" aria-label="Show assignee options" aria-expanded="true">⌄</button>
          </div>
        </label>
        <div className="combobox-popup" role="listbox" id="combobox-preview-options" aria-label="Assignee options">
          <button type="button" className="combobox-option is-active" id="combobox-preview-aditi" role="option" aria-selected="true">
            <span>Aditi Rao</span>
            <em>Design systems</em>
          </button>
          <button type="button" className="combobox-option" role="option" aria-selected="false">
            <span>Ada Lovelace</span>
            <em>Analytics</em>
          </button>
          <button type="button" className="combobox-option" role="option" aria-selected="false">
            <span>Adam Chen</span>
            <em>Operations</em>
          </button>
        </div>
        <p className="demo-status">Focus remains in the field while the active option is exposed.</p>
      </div>
    );
  }

  if (patternId === "search-suggestions") {
    return (
      <div className="quality-example">
        <label>
          <span>{meta.field}</span>
          <input value="mod" readOnly />
        </label>
        <div className="mini-result-list" role="listbox" aria-label="Search suggestions preview">
          <button type="button" className="pattern-row is-selected">modal dialog</button>
          <button type="button" className="pattern-row">modal focus trap</button>
          <button type="button" className="pattern-row">modal vs popover</button>
        </div>
        <p className="demo-status">3 query suggestions</p>
      </div>
    );
  }

  if (patternId === "recently-searched") {
    return (
      <div className="quality-example recent-searches-demo">
        <label>
          <span>{meta.field}</span>
          <input value="benefit appeal" readOnly />
        </label>
        <section className="recent-search-list" aria-label="Recent searches preview">
          <div className="recent-search-header">
            <strong>Recently searched</strong>
            <small>This account</small>
          </div>
          {["benefit appeal deadline", "housing evidence upload", "debt advice appointment"].map((item, index) => (
            <button type="button" className={index === 0 ? "is-selected" : ""} key={item}>
              <span>{item}</span>
              <em>{index === 0 ? "Searched 4 min ago" : index === 1 ? "Searched yesterday" : "Searched last week"}</em>
            </button>
          ))}
        </section>
        <p className="demo-status">Recent queries are passive history, separate from saved searches.</p>
      </div>
    );
  }

  if (patternId === "search-history") {
    return (
      <div className="quality-example search-history-demo">
        <div className="search-history-summary">
          <div>
            <span>Search history</span>
            <strong>On for art@example.com</strong>
          </div>
          <span>Retains 18 months</span>
        </div>
        <div className="search-history-filter-row">
          <span>Source: All products</span>
          <span>Range: Last 7 days</span>
          <span>12 search events</span>
        </div>
        <div className="search-history-list preview" aria-label="Search history preview">
          {[
            ["benefit appeal", "Drive - Today - this device"],
            ["housing evidence", "Gmail - Yesterday - workspace account"],
            ["debt advice", "Web Search - Jun 6 - synced"]
          ].map(([query, meta]) => (
            <div className="search-history-row" key={query}>
              <span>{query}</span>
              <em>{meta}</em>
              <button type="button" className="remove-recent-button">Delete</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "typeahead") {
    return (
      <div className="quality-example typeahead-demo">
        <label>
          <span>{meta.field}</span>
          <input value="cas" readOnly />
        </label>
        <div className="typeahead-status-row">
          <span>3 live results for cas</span>
          <em>Debounced - current query only</em>
        </div>
        <div className="typeahead-result-list preview" aria-label="Live typeahead results preview">
          {[
            ["Case 104 - Benefit appeal", "Case record - opened today"],
            ["Case 221 - Housing evidence", "Case record - Benefits workspace"],
            ["Case review checklist", "Knowledge article - 8 matches"]
          ].map(([title, detail], index) => (
            <button type="button" className={index === 0 ? "typeahead-result is-active" : "typeahead-result"} key={title}>
              <span>{title}</span>
              <em>{detail}</em>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "no-results-recovery") {
    return (
      <div className="quality-example">
        <label>
          <span>{meta.field}</span>
          <input value="wizard" readOnly />
        </label>
        <div className="demo-row" aria-label="Visible criteria">
          <span className="demo-button small">Query: wizard</span>
          <span className="demo-button small">Archived only</span>
        </div>
        <div className="demo-empty compact-empty" role="status">
          <h3>No matching patterns</h3>
          <p>0 results. Remove a filter or try a broader query.</p>
          <button type="button" className="demo-button small primary">Clear filters</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quality-example">
      <label>
        <span>{meta.field}</span>
        <input value={patternId === "autocomplete" ? "Ada" : ""} readOnly />
      </label>
      <p className="demo-status">{patternId === "no-results-recovery" ? "No matches: clear filters" : `${meta.options.length} results`}</p>
      <div className="result-preview">
        <strong>{meta.options[0]}</strong>
        <small>{meta.subject}</small>
      </div>
    </div>
  );
}

function SearchGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "basic-search") return <BasicSearchGoodUx meta={meta} />;
  if (patternId === "browse-by-category") return <BrowseByCategoryGoodUx />;
  if (patternId === "advanced-search") return <AdvancedSearchGoodUx />;
  if (patternId === "query-correction") return <QueryCorrectionGoodUx />;
  if (patternId === "recommendations") return <RecommendationsGoodUx />;
  if (patternId === "recently-searched") return <RecentlySearchedGoodUx />;
  if (patternId === "search-history") return <SearchHistoryGoodUx />;
  if (patternId === "search-scope-selector") return <SearchScopeSelectorGoodUx />;
  if (patternId === "search-result-highlighting") return <SearchResultHighlightingGoodUx />;
  if (patternId === "faceted-search") return <FacetedGoodUx />;
  if (patternId === "filter-panel") return <FilterPanelGoodUx />;
  if (patternId === "filter-reset-that-clears-unrelated-search") return <FilterResetSearchGoodUx />;
  if (patternId === "filter-chips") return <FilterChipsGoodUx />;
  if (patternId === "sort-controls") return <SortControlsGoodUx />;
  if (patternId === "saved-filter") return <SavedFilterGoodUx />;
  if (patternId === "saved-search") return <SavedSearchGoodUx />;
  if (patternId === "no-results-recovery") return <NoResultsRecoveryGoodUx meta={meta} />;
  if (patternId === "command-palette") return <CommandGoodUx meta={meta} />;
  if (patternId === "search-suggestions") return <SearchSuggestionsGoodUx meta={meta} />;
  if (patternId === "typeahead") return <TypeaheadGoodUx />;
  if (patternId === "combobox") return <ComboboxGoodUx meta={meta} />;
  if (patternId === "autocomplete") return <SuggestionsGoodUx patternId={patternId} meta={meta} />;

  const [query, setQuery] = useState(patternId === "no-results-recovery" ? "zzz" : "");
  const results = meta.options.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="quality-example">
      <label>
        <span>{meta.field}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type to filter" />
      </label>
      <p className="demo-status" aria-live="polite">{results.length} results</p>
      {results.length > 0 ? (
        <div className="mini-result-list">
          {results.map((item) => <button type="button" className="pattern-row" key={item}>{item}</button>)}
        </div>
      ) : (
        <div className="demo-empty compact-empty" role="status">
          <h3>No matches</h3>
          <button type="button" className="demo-button small" onClick={() => setQuery("")}>Clear search</button>
        </div>
      )}
    </div>
  );
}

type FilterChipItem = {
  id: "open" | "urgent" | "appeal" | "benefits" | "housing" | "recent";
  label: string;
  category: string;
};

type HighlightResultRecord = {
  id: string;
  title: string;
  type: string;
  snippet: string;
};

type SearchScopeId = "all" | "workspace" | "cases" | "people" | "org";

type AdvancedClauseId = "status" | "title" | "created" | "owner";

type QueryCorrectionMode = "corrected" | "original" | "uncorrected";

type QueryCorrectionCase = {
  submitted: string;
  corrected: string;
  changed: string[];
  correctedCount: number;
  originalCount: number;
  confidence: "high" | "medium" | "exact";
  note: string;
};

type RecommendationId = "appeal" | "evidence" | "debt" | "housing";

type RecommendationItem = {
  id: RecommendationId;
  title: string;
  type: string;
  reasonPersonal: string;
  reasonGeneric: string;
  source: string;
  available: boolean;
};

type BrowseCategoryId = "benefits" | "housing" | "money" | "transport" | "empty";

type BrowseCategory = {
  id: BrowseCategoryId;
  name: string;
  description: string;
  count: number;
  popular: string[];
  children: string[];
  emptyMessage?: string;
};

const browseCategories: BrowseCategory[] = [
  {
    id: "benefits",
    name: "Benefits",
    description: "Eligibility, appeals, tax credits, and Universal Credit.",
    count: 24,
    popular: ["Check benefit eligibility", "Appeal a decision", "Report a change"],
    children: ["Disability benefits", "Universal Credit", "Benefits for families"]
  },
  {
    id: "housing",
    name: "Housing and local services",
    description: "Owning, renting, repairs, council services, and local support.",
    count: 17,
    popular: ["Find council services", "Report a repair", "Apply for housing support"],
    children: ["Renting privately", "Council housing", "Local services"]
  },
  {
    id: "money",
    name: "Money and tax",
    description: "Debt, tax, Self Assessment, VAT, pensions, and payments.",
    count: 31,
    popular: ["File Self Assessment", "Get help with debt", "Check VAT guidance"],
    children: ["Personal tax", "Business tax", "Debt and savings"]
  },
  {
    id: "transport",
    name: "Driving and transport",
    description: "Vehicle tax, MOT, licences, transport rules, and travel.",
    count: 28,
    popular: ["Tax a vehicle", "Book an MOT", "Renew a driving licence"],
    children: ["Vehicles", "Driving licences", "Public transport"]
  },
  {
    id: "empty",
    name: "Moved topic",
    description: "A retired category kept only to demonstrate recovery.",
    count: 0,
    popular: [],
    children: [],
    emptyMessage: "This topic was merged into Benefits. No dead-end category page is shown."
  }
];

function BrowseByCategoryGoodUx() {
  const [activeId, setActiveId] = useState<BrowseCategoryId>("benefits");
  const [child, setChild] = useState("Disability benefits");
  const [message, setMessage] = useState("Benefits selected; parent, children, count, and popular tasks are in sync.");
  const active = browseCategories.find((category) => category.id === activeId) ?? browseCategories[0];

  const chooseCategory = (category: BrowseCategory) => {
    setActiveId(category.id);
    setChild(category.children[0] ?? "");
    setMessage(category.count === 0
      ? `${category.name} is empty, so the UI explains the merge and offers a parent/search route.`
      : `${category.name} selected; ${category.count} destinations and child topics are available.`);
  };

  return (
    <div className="quality-example browse-category-demo">
      <div className="browse-category-layout">
        <nav className="browse-category-grid" aria-label="Browse service categories">
          {browseCategories.map((category) => (
            <button
              type="button"
              className={category.id === activeId ? "browse-category-card is-active" : "browse-category-card"}
              onClick={() => chooseCategory(category)}
              key={category.id}
            >
              <strong>{category.name}</strong>
              <span>{category.description}</span>
              <small>{category.count === 0 ? "Merged topic" : `${category.count} destinations`}</small>
            </button>
          ))}
        </nav>
        <section className="browse-category-detail" aria-label="Selected category">
          <div className="browse-category-location">
            <span>Services and information</span>
            <strong>{active.name}</strong>
          </div>
          {active.count === 0 ? (
            <div className="browse-category-empty" role="status">
              <strong>No current category page</strong>
              <span>{active.emptyMessage}</span>
              <button type="button" className="demo-button small primary" onClick={() => chooseCategory(browseCategories[0])}>Go to Benefits</button>
            </div>
          ) : (
            <>
              <div className="browse-category-subtopics" aria-label={`${active.name} child topics`}>
                {active.children.map((item) => (
                  <button
                    type="button"
                    className={item === child ? "is-active" : ""}
                    onClick={() => {
                      setChild(item);
                      setMessage(`${item} opened inside ${active.name}; parent and sibling categories stay visible.`);
                    }}
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="browse-category-popular">
                <span>Most viewed in {active.name}</span>
                {active.popular.map((item) => <button type="button" className="pattern-row" key={item}>{item}</button>)}
              </div>
            </>
          )}
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

const recommendationItems: RecommendationItem[] = [
  {
    id: "appeal",
    title: "Appeal a benefit decision",
    type: "Service",
    reasonPersonal: "Because you saved appeals guidance",
    reasonGeneric: "Common next step in Benefits",
    source: "Saved pages and service use",
    available: true
  },
  {
    id: "evidence",
    title: "Upload evidence for a claim",
    type: "Task",
    reasonPersonal: "Next common task after appeal guidance",
    reasonGeneric: "Frequently used with appeals",
    source: "Task completion paths",
    available: true
  },
  {
    id: "debt",
    title: "Book a debt advice appointment",
    type: "Support",
    reasonPersonal: "Popular with benefits caseworkers",
    reasonGeneric: "Popular support service",
    source: "Aggregated usage",
    available: true
  },
  {
    id: "housing",
    title: "Apply for housing cost support",
    type: "Related service",
    reasonPersonal: "Matches your Benefits and Housing activity",
    reasonGeneric: "Editorial fallback for Benefits",
    source: "Browse category fallback",
    available: true
  }
];

function RecommendationsGoodUx() {
  const [personalized, setPersonalized] = useState(true);
  const [dismissed, setDismissed] = useState<RecommendationId[]>([]);
  const [saved, setSaved] = useState<RecommendationId[]>([]);
  const [message, setMessage] = useState("Each recommendation explains why it appears and can be dismissed.");
  const visibleItems = recommendationItems.filter((item) => !dismissed.includes(item.id));

  const dismissItem = (item: RecommendationItem) => {
    setDismissed((current) => [...current, item.id]);
    setMessage(`${item.title} hidden as not interested; feedback updates this list, not your recently viewed history.`);
  };

  const toggleSaved = (item: RecommendationItem) => {
    setSaved((current) => {
      if (current.includes(item.id)) {
        setMessage(`${item.title} removed from saved recommendations.`);
        return current.filter((id) => id !== item.id);
      }
      setMessage(`${item.title} saved for later without changing the recommendation reason.`);
      return [...current, item.id];
    });
  };

  return (
    <div className="quality-example recommendations-demo">
      <div className="recommendations-toolbar">
        <div>
          <span>Recommended for you</span>
          <strong>{personalized ? "Using recent activity and saved work" : "Generic Benefits fallback"}</strong>
        </div>
        <label className="recommendations-toggle">
          <input
            type="checkbox"
            checked={personalized}
            onChange={(event) => {
              setPersonalized(event.target.checked);
              setMessage(event.target.checked
                ? "Personalized recommendations restored with visible reasons."
                : "Personalization is off; reasons now identify the generic fallback source.");
            }}
          />
          <span>Use recent activity</span>
        </label>
      </div>
      {visibleItems.length > 0 ? (
        <div className="recommendations-list" aria-label="Recommended services">
          {visibleItems.map((item) => (
            <article className="recommendation-card" key={item.id}>
              <span>{item.type}</span>
              <strong>{item.title}</strong>
              <small>{personalized ? item.reasonPersonal : item.reasonGeneric}</small>
              <em>{item.source}</em>
              <div className="recommendation-actions">
                <button type="button" className="demo-button small primary" onClick={() => toggleSaved(item)}>
                  {saved.includes(item.id) ? "Saved" : "Save"}
                </button>
                <button type="button" className="demo-button small" onClick={() => dismissItem(item)}>Not interested</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="recommendations-empty" role="status">
          <strong>No recommendations shown</strong>
          <span>All visible items were dismissed. Show a labelled fallback instead of re-inserting hidden items.</span>
          <button type="button" className="demo-button small primary" onClick={() => {
            setDismissed([]);
            setMessage("Dismissed items restored for this demo.");
          }}>
            Restore demo items
          </button>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type AdvancedClause = {
  id: AdvancedClauseId;
  label: string;
  field: string;
  operator: "=" | "contains" | "after" | "is";
  value: string;
};

const baseAdvancedClauses: AdvancedClause[] = [
  { id: "status", label: "Status", field: "status", operator: "=", value: "Open" },
  { id: "title", label: "Title", field: "title", operator: "contains", value: "appeal" }
];

const optionalAdvancedDateClause: AdvancedClause = {
  id: "created",
  label: "Created",
  field: "created",
  operator: "after",
  value: "2026-01-01"
};

function serializeAdvancedClause(clause: AdvancedClause) {
  if (clause.operator === "contains") return `${clause.field}:"${clause.value}"`;
  if (clause.operator === "after") return `${clause.field}:>${clause.value}`;
  if (clause.operator === "is") return `${clause.field}:${clause.value}`;
  return `${clause.field}:${clause.value.toLowerCase()}`;
}

function AdvancedSearchGoodUx() {
  const [clauses, setClauses] = useState<AdvancedClause[]>(baseAdvancedClauses);
  const [joiner, setJoiner] = useState<"AND" | "OR">("AND");
  const [message, setMessage] = useState("Two valid clauses are ready; generated query and count preview match.");
  const hasDateClause = clauses.some((clause) => clause.id === "created");
  const hasBrokenQuote = clauses.some((clause) => clause.value.includes('"'));
  const queryPreview = clauses.map(serializeAdvancedClause).join(` ${joiner} `);
  const previewCount = hasBrokenQuote ? 0 : joiner === "OR" ? 42 : hasDateClause ? 7 : 18;

  const updateClauseValue = (id: AdvancedClauseId, value: string) => {
    setClauses((current) => current.map((clause) => (clause.id === id ? { ...clause, value } : clause)));
    setMessage(value.includes('"') ? "Unmatched quote detected in the clause value; repair before running search." : "Clause updated; query preview and result count recalculated.");
  };

  const addDateClause = () => {
    setClauses((current) => (current.some((clause) => clause.id === "created") ? current : [...current, optionalAdvancedDateClause]));
    setMessage("Created date clause added with a supported date operator.");
  };

  const removeClause = (id: AdvancedClauseId) => {
    setClauses((current) => current.filter((clause) => clause.id !== id));
    setMessage("Clause removed without clearing the remaining advanced query.");
  };

  const repairSyntax = () => {
    setClauses((current) => current.map((clause) => ({ ...clause, value: clause.value.replaceAll('"', "") })));
    setMessage("Syntax repaired; the original term was preserved and the query can run.");
  };

  return (
    <div className="quality-example advanced-search-demo">
      <div className="advanced-search-toolbar">
        <label>
          <span>Boolean join</span>
          <select
            value={joiner}
            onChange={(event) => {
              setJoiner(event.target.value as "AND" | "OR");
              setMessage(`Joiner changed to ${event.target.value}; preview count updated before search.`);
            }}
          >
            <option>AND</option>
            <option>OR</option>
          </select>
        </label>
        <button type="button" className="demo-button small" onClick={addDateClause}>Add date clause</button>
        <button type="button" className="demo-button small" onClick={() => updateClauseValue("title", '"appeal')}>Break quote</button>
      </div>
      <div className="advanced-search-clause-list" aria-label="Advanced search clauses">
        {clauses.map((clause, index) => (
          <div className={clause.value.includes('"') ? "advanced-search-clause is-invalid" : "advanced-search-clause"} key={clause.id}>
            <span className="advanced-search-clause-index">{index === 0 ? "Where" : joiner}</span>
            <label>
              <span>Field</span>
              <input value={clause.label} readOnly />
            </label>
            <label>
              <span>Operator</span>
              <input value={clause.operator} readOnly />
            </label>
            <label>
              <span>Value</span>
              <input value={clause.value} onChange={(event) => updateClauseValue(clause.id, event.target.value)} />
            </label>
            <button type="button" className="demo-button small" onClick={() => removeClause(clause.id)} aria-label={`Remove ${clause.label} clause`}>Remove</button>
          </div>
        ))}
      </div>
      <section className="advanced-search-query-preview" aria-label="Generated advanced query">
        <span>Generated query</span>
        <code>{queryPreview || "No clauses yet"}</code>
      </section>
      <section className={hasBrokenQuote ? "advanced-search-count-preview is-invalid" : "advanced-search-count-preview"} aria-live="polite">
        <strong>{hasBrokenQuote ? "Syntax repair required" : `${previewCount} preview matches`}</strong>
        <span>{hasBrokenQuote ? "The title clause has an unmatched quote; search is blocked until repaired." : "Count preview uses the current clauses, joiner, and field/operator rules."}</span>
        {hasBrokenQuote && <button type="button" className="demo-button small primary" onClick={repairSyntax}>Repair quote</button>}
      </section>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

const queryCorrectionCases: QueryCorrectionCase[] = [
  {
    submitted: "benifit appeel",
    corrected: "benefit appeal",
    changed: ["benifit -> benefit", "appeel -> appeal"],
    correctedCount: 22,
    originalCount: 0,
    confidence: "high",
    note: "High-confidence spelling correction applied with the original query still available."
  },
  {
    submitted: "benefit apeal dealine",
    corrected: "benefit appeal deadline",
    changed: ["apeal -> appeal", "dealine -> deadline"],
    correctedCount: 9,
    originalCount: 1,
    confidence: "high",
    note: "Corrected phrase keeps the user's topic and updates result count."
  },
  {
    submitted: "AB-1047",
    corrected: "AB-1047",
    changed: [],
    correctedCount: 2,
    originalCount: 2,
    confidence: "exact",
    note: "Identifier-like token is treated as exact; no spelling correction is applied."
  }
];

function findQueryCorrectionCase(query: string): QueryCorrectionCase {
  const normalized = query.trim().toLowerCase();
  return queryCorrectionCases.find((item) => item.submitted.toLowerCase() === normalized) ?? {
    submitted: query.trim() || "benifit appeel",
    corrected: query.trim() || "benifit appeel",
    changed: [],
    correctedCount: query.trim() ? 3 : 0,
    originalCount: query.trim() ? 3 : 0,
    confidence: "medium",
    note: "No strong correction candidate; search runs with the submitted wording."
  };
}

function QueryCorrectionGoodUx() {
  const [draftQuery, setDraftQuery] = useState("benifit appeel");
  const [submittedQuery, setSubmittedQuery] = useState("benifit appeel");
  const [activeQuery, setActiveQuery] = useState("benefit appeal");
  const [mode, setMode] = useState<QueryCorrectionMode>("corrected");
  const [message, setMessage] = useState("Corrected results are shown, with the submitted query preserved.");
  const correction = findQueryCorrectionCase(submittedQuery);
  const hasCorrection = correction.corrected !== correction.submitted && correction.confidence === "high";
  const showCorrectionControls = hasCorrection && mode !== "uncorrected";
  const showingCorrected = showCorrectionControls && mode === "corrected";
  const activeCount = showingCorrected ? correction.correctedCount : correction.originalCount;
  const resultTitles = showingCorrected
    ? ["Benefit appeal deadline", "Appeal a benefit decision", "Upload evidence for an appeal"]
    : ["Exact query record", "Search log match", "Manual spelling fallback"];

  const submitQuery = () => {
    const next = draftQuery.trim() || "benifit appeel";
    const nextCorrection = findQueryCorrectionCase(next);
    setSubmittedQuery(next);
    if (nextCorrection.corrected !== nextCorrection.submitted && nextCorrection.confidence === "high") {
      setActiveQuery(nextCorrection.corrected);
      setMode("corrected");
      setMessage(`Showing corrected results for ${nextCorrection.corrected}; original query ${nextCorrection.submitted} is still available.`);
    } else {
      setActiveQuery(nextCorrection.submitted);
      setMode("uncorrected");
      setMessage(nextCorrection.note);
    }
  };

  const searchOriginal = () => {
    setActiveQuery(correction.submitted);
    setMode("original");
    setMessage(`Searched the original query ${correction.submitted}; correction remains reversible.`);
  };

  const applyCorrection = () => {
    setActiveQuery(correction.corrected);
    setDraftQuery(correction.corrected);
    setMode("corrected");
    setMessage(`Applied corrected query ${correction.corrected}; changed tokens stay visible.`);
  };

  const clearCorrection = () => {
    setDraftQuery("");
    setSubmittedQuery("");
    setActiveQuery("");
    setMode("uncorrected");
    setMessage("Correction cleared; the next result state will be based on a new submitted query.");
  };

  return (
    <div className="quality-example query-correction-demo">
      <div className="query-correction-toolbar">
        <label>
          <span>Submitted query</span>
          <input
            value={draftQuery}
            onChange={(event) => {
              const nextDraft = event.target.value;
              setDraftQuery(nextDraft);
              setSubmittedQuery(nextDraft);
              setActiveQuery(nextDraft);
              if (mode !== "uncorrected") {
                setMode("uncorrected");
                setMessage("Query edited; stale correction cleared until the next submit.");
              }
            }}
          />
        </label>
        <button type="button" className="demo-button small primary" onClick={submitQuery}>Search</button>
        <button type="button" className="demo-button small" onClick={clearCorrection}>Clear</button>
      </div>

      {showCorrectionControls ? (
        <section className="query-correction-banner" aria-live="polite">
          <span>{showingCorrected ? "Showing results for" : "Correction available"}</span>
          <strong>{showingCorrected ? correction.corrected : correction.submitted}</strong>
          <div className="query-correction-token-row" aria-label="Changed query tokens">
            {correction.changed.map((item) => <mark key={item}>{item}</mark>)}
          </div>
          <div className="query-correction-actions">
            {showingCorrected ? (
              <button type="button" className="demo-button small" onClick={searchOriginal}>Search original: {correction.submitted}</button>
            ) : (
              <button type="button" className="demo-button small primary" onClick={applyCorrection}>Apply correction: {correction.corrected}</button>
            )}
          </div>
        </section>
      ) : (
        <section className="query-correction-banner neutral" aria-live="polite">
          <span>No automatic correction</span>
          <strong>{submittedQuery || "No query submitted"}</strong>
          <p>{correction.note}</p>
        </section>
      )}

      <div className="query-correction-result-panel">
        <strong>{activeCount} {showingCorrected ? "corrected" : "original"} results</strong>
        <span>Active query: {activeQuery || "none"}</span>
      </div>
      <div className="mini-result-list">
        {resultTitles.slice(0, activeCount > 0 ? 3 : 0).map((item) => (
          <button type="button" className="pattern-row" key={item}>{item}</button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type SearchScopeOption = {
  id: SearchScopeId;
  label: string;
  corpus: string;
  count: number;
  unavailable?: boolean;
  unavailableReason?: string;
};

const searchScopeOptions: SearchScopeOption[] = [
  { id: "workspace", label: "Current workspace", corpus: "Benefits workspace pages and files", count: 12 },
  { id: "all", label: "All knowledge", corpus: "All searchable spaces, files, and posts", count: 38 },
  { id: "cases", label: "Cases", corpus: "Case records and decision notes", count: 9 },
  { id: "people", label: "People", corpus: "Profiles and teams", count: 3 },
  { id: "org", label: "Organization", corpus: "Whole organization index", count: 84, unavailable: true, unavailableReason: "Unavailable for guest users" }
];

function SearchScopeSelectorGoodUx() {
  const [query, setQuery] = useState("appeal");
  const [activeScope, setActiveScope] = useState<SearchScopeId>("workspace");
  const [page, setPage] = useState(2);
  const [message, setMessage] = useState("Current workspace searches Benefits workspace pages and files.");
  const scope = searchScopeOptions.find((item) => item.id === activeScope) ?? searchScopeOptions[0];
  const visibleResults = [
    `${query} intake guide`,
    `${query} review checklist`,
    `${query} owner directory`
  ];

  const chooseScope = (next: SearchScopeOption) => {
    if (next.unavailable) {
      setMessage(`${next.label} is disabled: ${next.unavailableReason}. Query "${query}" is preserved.`);
      return;
    }
    setActiveScope(next.id);
    setPage(1);
    setMessage(`Scope changed to ${next.label}; query "${query}" was preserved and pagination reset to page 1.`);
  };

  const submitSearch = () => {
    setPage(1);
    setMessage(`Submitted "${query}" in ${scope.label}; result count and scope summary updated together.`);
  };

  return (
    <div className="quality-example search-scope-demo">
      <div className="search-scope-toolbar">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="demo-button small primary" onClick={submitSearch}>Search scope</button>
      </div>
      <fieldset className="search-scope-fieldset">
        <legend>Search within</legend>
        <div className="search-scope-segments">
          {searchScopeOptions.map((item) => (
            <button
              type="button"
              className={item.id === activeScope ? "is-active" : ""}
              aria-pressed={item.id === activeScope}
              aria-disabled={item.unavailable}
              key={item.id}
              onClick={() => chooseScope(item)}
            >
              <span>{item.label}</span>
              <small>{item.unavailable ? item.unavailableReason : `${item.count} results`}</small>
            </button>
          ))}
        </div>
      </fieldset>
      <section className="search-scope-results" aria-label="Scoped search results">
        <div className="search-scope-summary" aria-live="polite">
          <strong>Results for {query || "empty query"} in {scope.label}</strong>
          <span>{scope.count} results - {scope.corpus} - page {page}</span>
        </div>
        <div className="mini-result-list">
          {visibleResults.map((result, index) => (
            <button type="button" className="pattern-row" key={`${scope.id}-${result}`}>
              <span>{result}</span>
              <small>{scope.label} result {index + 1}</small>
            </button>
          ))}
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

const highlightRecords: HighlightResultRecord[] = [
  {
    id: "benefits-policy",
    title: "Benefits appeal policy",
    type: "Policy",
    snippet: "Submit an appeal within 30 days of the benefits notice and include the case reference on every document."
  },
  {
    id: "deadline-guide",
    title: "Appeal deadline guide",
    type: "Guide",
    snippet: "The review team can extend an appeal deadline when the benefits letter arrived late or the claimant needed translation support."
  },
  {
    id: "housing-notice",
    title: "Housing benefit notice",
    type: "Template",
    snippet: "Use this notice when housing benefit changes need a plain-language explanation and a review route."
  },
  {
    id: "case-review",
    title: "Case review checklist",
    type: "Checklist",
    snippet: "Confirm the appeal owner, document status, and benefit category before assigning the case to a reviewer."
  }
];

function queryTerms(query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]+/g, ""))
    .filter((term) => term.length > 1);
}

function countTermMatches(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.reduce((total, term) => {
    const matches = lower.match(new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"));
    return total + (matches?.length ?? 0);
  }, 0);
}

function highlightText(text: string, terms: string[]) {
  if (terms.length === 0) return text;
  const escapedTerms = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matcher = new RegExp(`\\b(${escapedTerms.join("|")})\\b`, "gi");
  return text.split(matcher).filter(Boolean).map((part, index) => (
    terms.includes(part.toLowerCase())
      ? <mark className="search-highlight-match" key={`${part}-${index}`}>{part}</mark>
      : <span key={`${part}-${index}`}>{part}</span>
  ));
}

function SearchResultHighlightingGoodUx() {
  const [query, setQuery] = useState("benefits appeal");
  const [showTitle, setShowTitle] = useState(true);
  const [showSnippet, setShowSnippet] = useState(true);
  const [message, setMessage] = useState("Highlights show why the current results matched benefits appeal.");
  const terms = queryTerms(query);
  const records = highlightRecords.filter((record) => {
    const searchable = `${record.title} ${record.snippet}`.toLowerCase();
    return terms.length === 0 || terms.some((term) => searchable.includes(term));
  });
  const titleMatches = showTitle ? records.reduce((total, record) => total + countTermMatches(record.title, terms), 0) : 0;
  const snippetMatches = showSnippet ? records.reduce((total, record) => total + countTermMatches(record.snippet, terms), 0) : 0;
  const totalMatches = titleMatches + snippetMatches;

  const runQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    const nextTerms = queryTerms(nextQuery);
    const nextCount = highlightRecords.reduce((total, record) => (
      total + countTermMatches(`${record.title} ${record.snippet}`, nextTerms)
    ), 0);
    setMessage(`Submitted "${nextQuery}" and recalculated ${nextCount} safe text highlights.`);
  };

  return (
    <div className="quality-example search-highlight-demo">
      <div className="search-highlight-toolbar">
        <label>
          <span>Submitted query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="demo-button small primary" onClick={() => runQuery(query)}>Refresh highlights</button>
        <button type="button" className="demo-button small" onClick={() => runQuery("housing benefit")}>Try housing benefit</button>
      </div>
      <div className="search-highlight-options" aria-label="Highlighted fields">
        <label className="checkbox-label">
          <input type="checkbox" checked={showTitle} onChange={(event) => {
            setShowTitle(event.target.checked);
            setMessage(event.target.checked ? "Title highlights enabled without changing result order." : "Title highlights hidden; result order stayed unchanged.");
          }} />
          Title matches
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={showSnippet} onChange={(event) => {
            setShowSnippet(event.target.checked);
            setMessage(event.target.checked ? "Snippet highlights enabled with surrounding context." : "Snippet highlights hidden; snippets remain readable.");
          }} />
          Snippet matches
        </label>
        <span className="search-highlight-count">{records.length} results - {totalMatches} highlighted fragments</span>
      </div>
      <div className="search-highlight-results" aria-label="Highlighted search results">
        {records.length > 0 ? records.map((record) => (
          <article className="search-highlight-result" key={record.id}>
            <div className="search-highlight-result-meta">
              <span>{record.type}</span>
              <small>
                {showTitle ? countTermMatches(record.title, terms) : 0} title matches; {showSnippet ? countTermMatches(record.snippet, terms) : 0} snippet matches
              </small>
            </div>
            <strong>{showTitle ? highlightText(record.title, terms) : record.title}</strong>
            <p>... {showSnippet ? highlightText(record.snippet, terms) : record.snippet} ...</p>
          </article>
        )) : (
          <div className="demo-empty compact-empty" role="status">
            <h3>No highlighted results</h3>
            <button type="button" className="demo-button small" onClick={() => runQuery("benefits appeal")}>Restore query</button>
          </div>
        )}
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type SortOption = "relevance" | "due-asc" | "due-desc" | "amount-desc" | "name-asc";

type SortRecord = {
  id: string;
  name: string;
  due: string;
  dueLabel: string;
  amount: number;
  status: "Open" | "Closed";
  relevance: number;
};

type SavedSearchCriteria = {
  query: string;
  status: "Open" | "All";
  sort: "Updated newest" | "Due soon";
};

type SavedSearchItem = {
  id: string;
  name: string;
  owner: string;
  visibility: "Private" | "Shared";
  favorite: boolean;
  alert: boolean;
  criteria: SavedSearchCriteria;
  lastRun: string;
};

type SavedFilterCriteria = {
  status: "Open" | "Pending" | "Any";
  team: "Benefits" | "Review" | "Housing" | "Any";
  priority: "High" | "Normal" | "Any";
  date: "Any" | "Last 30 days";
};

type SavedFilterItem = {
  id: string;
  name: string;
  owner: string;
  visibility: "Private" | "Team";
  criteria: SavedFilterCriteria;
  lastUpdated: string;
};

function criteriaSummary(criteria: SavedFilterCriteria) {
  return [
    `Status: ${criteria.status}`,
    `Team: ${criteria.team}`,
    `Priority: ${criteria.priority}`,
    `Date: ${criteria.date}`
  ];
}

function SavedFilterGoodUx() {
  const [savedFilters, setSavedFilters] = useState<SavedFilterItem[]>([
    {
      id: "high-benefits",
      name: "High priority benefits",
      owner: "You",
      visibility: "Team",
      criteria: { status: "Open", team: "Benefits", priority: "High", date: "Any" },
      lastUpdated: "Today"
    },
    {
      id: "review-queue",
      name: "My review queue",
      owner: "You",
      visibility: "Private",
      criteria: { status: "Open", team: "Review", priority: "Any", date: "Last 30 days" },
      lastUpdated: "Yesterday"
    },
    {
      id: "housing-watch",
      name: "Housing watch",
      owner: "Ops lead",
      visibility: "Team",
      criteria: { status: "Pending", team: "Housing", priority: "Normal", date: "Last 30 days" },
      lastUpdated: "May 30"
    }
  ]);
  const [activeId, setActiveId] = useState("high-benefits");
  const [query] = useState("appeal");
  const [sort] = useState("Newest");
  const [status, setStatus] = useState<SavedFilterCriteria["status"]>("Open");
  const [team, setTeam] = useState<SavedFilterCriteria["team"]>("Benefits");
  const [priority, setPriority] = useState<SavedFilterCriteria["priority"]>("High");
  const [date, setDate] = useState<SavedFilterCriteria["date"]>("Any");
  const [name, setName] = useState("Benefits escalation");
  const [visibility, setVisibility] = useState<SavedFilterItem["visibility"]>("Private");
  const [message, setMessage] = useState("High priority benefits applied; query appeal and sort Newest are preserved.");

  const active = savedFilters.find((item) => item.id === activeId) ?? savedFilters[0];
  const currentCriteria: SavedFilterCriteria = { status, team, priority, date };
  const modified = Boolean(active) && (
    status !== active.criteria.status ||
    team !== active.criteria.team ||
    priority !== active.criteria.priority ||
    date !== active.criteria.date
  );
  const activeCount = Object.values(currentCriteria).filter((value) => value !== "Any").length;
  const resultCount = Math.max(0, 18 - activeCount * 3 + (priority === "High" ? 2 : 0) + (team === "Housing" ? 1 : 0));

  const applySavedFilter = (item: SavedFilterItem) => {
    setActiveId(item.id);
    setStatus(item.criteria.status);
    setTeam(item.criteria.team);
    setPriority(item.criteria.priority);
    setDate(item.criteria.date);
    setVisibility(item.visibility);
    setMessage(`${item.name} applied ${criteriaSummary(item.criteria).join(", ")}; query "${query}" and sort "${sort}" stayed unchanged.`);
  };

  const saveAsNew = () => {
    const id = `filter-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "preset"}`;
    const next: SavedFilterItem = {
      id,
      name,
      owner: "You",
      visibility,
      criteria: currentCriteria,
      lastUpdated: "Just now"
    };
    setSavedFilters((current) => [next, ...current.filter((item) => item.id !== id)]);
    setActiveId(id);
    setMessage(`${name} saved as a ${visibility.toLowerCase()} filter preset; it stores criteria only, not query "${query}" or sort "${sort}".`);
  };

  const updateActive = () => {
    if (!active) return;
    setSavedFilters((current) => current.map((item) => item.id === active.id ? {
      ...item,
      criteria: currentCriteria,
      visibility,
      lastUpdated: "Updated now"
    } : item));
    setMessage(`${active.name} criteria updated; shared users will see the same filter values next time.`);
  };

  const clearPreset = () => {
    setActiveId("");
    setMessage(`Saved-filter identity cleared; current criteria remain visible and query "${query}" with sort "${sort}" is unchanged.`);
  };

  return (
    <div className="quality-example saved-filter-demo">
      <div className="saved-filter-toolbar">
        <div className="saved-filter-context">
          <span>Search query</span>
          <strong>{query}</strong>
        </div>
        <div className="saved-filter-context">
          <span>Sort order</span>
          <strong>{sort}</strong>
        </div>
        <label>
          <span>Visibility</span>
          <select value={visibility} onChange={(event) => setVisibility(event.target.value as SavedFilterItem["visibility"])}>
            <option>Private</option>
            <option>Team</option>
          </select>
        </label>
      </div>
      <div className="saved-filter-layout">
        <aside className="saved-filter-list" aria-label="Saved filters">
          {savedFilters.map((item) => (
            <button
              type="button"
              className={item.id === activeId ? "is-active" : ""}
              key={item.id}
              onClick={() => applySavedFilter(item)}
            >
              <span>{item.name}</span>
              <small>{item.visibility} - owner {item.owner}</small>
              <small>{criteriaSummary(item.criteria).slice(0, 3).join("; ")}</small>
            </button>
          ))}
        </aside>
        <section className="saved-filter-panel" aria-label="Active saved filter">
          <div className="saved-filter-summary" aria-live="polite">
            <strong>{activeId ? active?.name : "No saved filter selected"}</strong>
            <span>{resultCount} current matches - {activeCount} active criteria</span>
            <small>Query "{query}" and sort "{sort}" are separate from this preset.</small>
            {modified && activeId && <em>Current filter values differ from the saved preset.</em>}
          </div>
          <div className="saved-filter-control-grid">
            <label>
              <span>Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as SavedFilterCriteria["status"])}>
                <option>Any</option>
                <option>Open</option>
                <option>Pending</option>
              </select>
            </label>
            <label>
              <span>Team</span>
              <select value={team} onChange={(event) => setTeam(event.target.value as SavedFilterCriteria["team"])}>
                <option>Any</option>
                <option>Benefits</option>
                <option>Review</option>
                <option>Housing</option>
              </select>
            </label>
            <label>
              <span>Priority</span>
              <select value={priority} onChange={(event) => setPriority(event.target.value as SavedFilterCriteria["priority"])}>
                <option>Any</option>
                <option>High</option>
                <option>Normal</option>
              </select>
            </label>
            <label>
              <span>Date</span>
              <select value={date} onChange={(event) => setDate(event.target.value as SavedFilterCriteria["date"])}>
                <option>Any</option>
                <option>Last 30 days</option>
              </select>
            </label>
          </div>
          <div className="saved-filter-chip-row" aria-label="Current filter criteria">
            {criteriaSummary(currentCriteria).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="saved-filter-save-form">
            <label>
              <span>New filter name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <button type="button" className="demo-button small primary" onClick={saveAsNew}>Save as new</button>
            <button type="button" className="demo-button small" disabled={!modified || !activeId} onClick={updateActive}>Update saved</button>
            <button type="button" className="demo-button small" onClick={clearPreset}>Clear preset</button>
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SavedSearchGoodUx() {
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([
    {
      id: "renewal",
      name: "Renewal risk",
      owner: "You",
      visibility: "Private",
      favorite: true,
      alert: false,
      criteria: { query: "owner:me renewal", status: "Open", sort: "Updated newest" },
      lastRun: "Today"
    },
    {
      id: "blocked",
      name: "My blocked reviews",
      owner: "Design ops",
      visibility: "Shared",
      favorite: false,
      alert: true,
      criteria: { query: "review blocked", status: "Open", sort: "Due soon" },
      lastRun: "Yesterday"
    }
  ]);
  const [activeId, setActiveId] = useState("renewal");
  const [query, setQuery] = useState("owner:me renewal");
  const [status, setStatus] = useState<SavedSearchCriteria["status"]>("Open");
  const [sort, setSort] = useState<SavedSearchCriteria["sort"]>("Updated newest");
  const [name, setName] = useState("Open renewal risks");
  const [visibility, setVisibility] = useState<SavedSearchItem["visibility"]>("Private");
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("Renewal risk reruns saved criteria against current work items.");

  const active = savedSearches.find((item) => item.id === activeId) ?? savedSearches[0];
  const modified = Boolean(active) && (
    query !== active.criteria.query ||
    status !== active.criteria.status ||
    sort !== active.criteria.sort
  );
  const resultCount = Math.max(0, 8 + query.length % 5 + (status === "Open" ? 3 : 7) + (sort === "Due soon" ? 2 : 0));

  const runSavedSearch = (item: SavedSearchItem) => {
    setActiveId(item.id);
    setQuery(item.criteria.query);
    setStatus(item.criteria.status);
    setSort(item.criteria.sort);
    setVisibility(item.visibility);
    setAlert(item.alert);
    setMessage(`${item.name} loaded saved criteria and found ${resultCount + 1} current matches.`);
  };

  const saveCurrentSearch = () => {
    const next: SavedSearchItem = {
      id: `saved-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "search"}`,
      name,
      owner: "You",
      visibility,
      favorite: true,
      alert,
      criteria: { query, status, sort },
      lastRun: "Just now"
    };
    setSavedSearches((current) => [next, ...current.filter((item) => item.id !== next.id)]);
    setActiveId(next.id);
    setMessage(`${name} saved as ${visibility.toLowerCase()} criteria; future runs include new matching records.`);
  };

  const updateActiveCriteria = () => {
    if (!active) return;
    setSavedSearches((current) => current.map((item) => item.id === active.id ? {
      ...item,
      criteria: { query, status, sort },
      visibility,
      alert,
      lastRun: "Updated now"
    } : item));
    setMessage(`${active.name} criteria updated; alerts and shared views will use the new definition.`);
  };

  const toggleActiveSharing = () => {
    if (!active) return;
    const nextVisibility = visibility === "Private" ? "Shared" : "Private";
    setVisibility(nextVisibility);
    setSavedSearches((current) => current.map((item) => item.id === active.id ? { ...item, visibility: nextVisibility } : item));
    setMessage(`${active.name} is now ${nextVisibility.toLowerCase()}; audience is visible before sharing.`);
  };

  const toggleAlert = () => {
    if (!active) return;
    const nextAlert = !alert;
    setAlert(nextAlert);
    setSavedSearches((current) => current.map((item) => item.id === active.id ? { ...item, alert: nextAlert } : item));
    setMessage(nextAlert ? `${active.name} will send weekly result changes.` : `${active.name} alert subscription removed.`);
  };

  return (
    <div className="quality-example saved-search-demo">
      <div className="saved-search-toolbar">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as SavedSearchCriteria["status"])}>
            <option>Open</option>
            <option>All</option>
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SavedSearchCriteria["sort"])}>
            <option>Updated newest</option>
            <option>Due soon</option>
          </select>
        </label>
      </div>
      <div className="saved-search-layout">
        <aside className="saved-search-list" aria-label="Saved searches">
          {savedSearches.map((item) => (
            <button
              type="button"
              className={item.id === activeId ? "is-active" : ""}
              key={item.id}
              onClick={() => runSavedSearch(item)}
            >
              <span>{item.favorite ? "★ " : ""}{item.name}</span>
              <small>{item.visibility}{item.alert ? " - alert" : ""}</small>
            </button>
          ))}
        </aside>
        <section className="saved-search-panel" aria-label="Active saved search">
          <div className="saved-search-summary" aria-live="polite">
            <strong>{active?.name ?? "Unsaved search"}</strong>
            <span>{resultCount} current matches - {visibility} - owner {active?.owner ?? "You"}</span>
            <small>Criteria: {query}; {status}; {sort}</small>
            {modified && <em>Current criteria differ from the saved definition.</em>}
          </div>
          <div className="saved-search-save-form">
            <label>
              <span>Name current search</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span>Visibility</span>
              <select value={visibility} onChange={(event) => setVisibility(event.target.value as SavedSearchItem["visibility"])}>
                <option>Private</option>
                <option>Shared</option>
              </select>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={alert} onChange={(event) => setAlert(event.target.checked)} />
              Weekly alert
            </label>
          </div>
          <div className="saved-search-actions">
            <button type="button" className="demo-button small primary" onClick={saveCurrentSearch}>Save as new</button>
            <button type="button" className="demo-button small" disabled={!modified} onClick={updateActiveCriteria}>Update saved</button>
            <button type="button" className="demo-button small" onClick={toggleActiveSharing}>{visibility === "Private" ? "Share" : "Make private"}</button>
            <button type="button" className="demo-button small" onClick={toggleAlert}>{alert ? "Remove alert" : "Add alert"}</button>
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SortControlsGoodUx() {
  const records: SortRecord[] = [
    { id: "104", name: "Appeal case 104", due: "2026-02-20", dueLabel: "Feb 20, 2026", amount: 1400, status: "Open", relevance: 98 },
    { id: "221", name: "Housing case 221", due: "2026-01-12", dueLabel: "Jan 12, 2026", amount: 900, status: "Open", relevance: 77 },
    { id: "318", name: "Urgent housing appeal 318", due: "2026-03-02", dueLabel: "Mar 2, 2026", amount: 700, status: "Open", relevance: 92 },
    { id: "087", name: "Closed benefit appeal 087", due: "2025-12-18", dueLabel: "Dec 18, 2025", amount: 2200, status: "Closed", relevance: 71 },
    { id: "144", name: "Benefit check 144", due: "2026-04-09", dueLabel: "Apr 9, 2026", amount: 300, status: "Open", relevance: 64 }
  ];
  const [query, setQuery] = useState("e");
  const [openOnly, setOpenOnly] = useState(true);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [page, setPage] = useState(2);
  const [message, setMessage] = useState("Default relevance order is active; query and filter state are visible.");

  const matchingRecords = records.filter((record) => {
    const matchesQuery = !query.trim() || record.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (!openOnly || record.status === "Open");
  });

  const sortedRecords = [...matchingRecords].sort((a, b) => {
    if (sort === "due-asc") return Date.parse(a.due) - Date.parse(b.due);
    if (sort === "due-desc") return Date.parse(b.due) - Date.parse(a.due);
    if (sort === "amount-desc") return b.amount - a.amount;
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    return b.relevance - a.relevance;
  });
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleRows = sortedRecords.slice((safePage - 1) * pageSize, safePage * pageSize);
  const sortLabels: Record<SortOption, string> = {
    relevance: "Relevance",
    "due-asc": "Due date (oldest first)",
    "due-desc": "Due date (newest first)",
    "amount-desc": "Amount (highest first)",
    "name-asc": "Case name (A to Z)"
  };

  const changeSort = (next: SortOption) => {
    setSort(next);
    setPage(1);
    setMessage(`${sortLabels[next]} applied to all ${matchingRecords.length} matching cases; page reset to 1 while query and filters stayed set.`);
  };

  const toggleDueHeader = () => {
    changeSort(sort === "due-asc" ? "due-desc" : "due-asc");
  };

  return (
    <div className="quality-example sort-controls-demo">
      <div className="sort-controls-grid">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
        </label>
        <label>
          <span>Sort by</span>
          <select value={sort} onChange={(event) => changeSort(event.target.value as SortOption)}>
            <option value="relevance">Relevance</option>
            <option value="due-asc">Due date (oldest first)</option>
            <option value="due-desc">Due date (newest first)</option>
            <option value="amount-desc">Amount (highest first)</option>
            <option value="name-asc">Case name (A to Z)</option>
          </select>
        </label>
      </div>
      <div className="sort-controls-row">
        <label className="checkbox-label">
          <input type="checkbox" checked={openOnly} onChange={(event) => { setOpenOnly(event.target.checked); setPage(1); }} />
          Open cases only
        </label>
        <span className="sort-order-badge">Page {safePage} of {pageCount}</span>
      </div>
      <div className="sort-result-panel" aria-label="Sorted case results">
        <div className="sort-summary" aria-live="polite">
          <strong>{sortedRecords.length} cases sorted by {sortLabels[sort]}</strong>
          <span>Query: {query || "all"} - Filter: {openOnly ? "Open only" : "All statuses"} - applies before pagination</span>
        </div>
        <table className="sort-demo-table">
          <thead>
            <tr>
              <th scope="col">Case</th>
              <th scope="col" aria-sort={sort === "due-asc" ? "ascending" : sort === "due-desc" ? "descending" : "none"}>
                <button type="button" onClick={toggleDueHeader}>
                  Due date {sort === "due-asc" ? "↑" : sort === "due-desc" ? "↓" : ""}
                </button>
              </th>
              <th scope="col" aria-sort={sort === "amount-desc" ? "descending" : "none"}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.dueLabel}</td>
                <td>${record.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sort-pagination-controls" aria-label="Pagination preview">
          <button type="button" className="demo-button small" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
          <button type="button" className="demo-button small" disabled={safePage >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type FilterResetSearchMode =
  | "clearOne"
  | "clearAllFilters"
  | "clearSearch"
  | "resetDraft"
  | "noResultsRecovery"
  | "savedFilterBoundary"
  | "savedSearchBundle"
  | "sortPreserved"
  | "paginationPolicy"
  | "mobileReset"
  | "undoReset"
  | "urlState";

type FilterResetSearchBadMode =
  | "queryWiped"
  | "oneChipClearsAll"
  | "mobileResetWipesSearch"
  | "broadStartOver"
  | "savedFilterWipesQuery"
  | "sortReset"
  | "historyDeleted"
  | "draftResetClearsApplied";

const filterResetGoodModes: Array<{ mode: FilterResetSearchMode; label: string }> = [
  { mode: "clearOne", label: "Clear one filter" },
  { mode: "clearAllFilters", label: "Clear all filters" },
  { mode: "clearSearch", label: "Clear search" },
  { mode: "resetDraft", label: "Reset draft" },
  { mode: "noResultsRecovery", label: "No-results recovery" },
  { mode: "savedFilterBoundary", label: "Saved filter boundary" },
  { mode: "savedSearchBundle", label: "Saved search bundle" },
  { mode: "sortPreserved", label: "Sort preserved" },
  { mode: "paginationPolicy", label: "Pagination policy" },
  { mode: "mobileReset", label: "Mobile reset" },
  { mode: "undoReset", label: "Undo reset" },
  { mode: "urlState", label: "URL state" }
];

const filterResetBadModes: Array<{ mode: FilterResetSearchBadMode; label: string }> = [
  { mode: "queryWiped", label: "Query wiped" },
  { mode: "oneChipClearsAll", label: "One chip clears all" },
  { mode: "mobileResetWipesSearch", label: "Mobile reset wipes search" },
  { mode: "broadStartOver", label: "Broad start over" },
  { mode: "savedFilterWipesQuery", label: "Saved filter wipes query" },
  { mode: "sortReset", label: "Sort reset" },
  { mode: "historyDeleted", label: "History deleted" },
  { mode: "draftResetClearsApplied", label: "Draft reset clears applied" }
];

function FilterResetSearchGoodUi() {
  return (
    <div className="quality-example filter-reset-demo" aria-label="Scoped filter reset preview">
      <FilterResetSearchPanel mode="clearAllFilters" idSuffix="good-ui" />
      <p className="demo-status">Clear filters removes filter chips only; query, sort, saved search, page policy, and URL state stay visible.</p>
    </div>
  );
}

function FilterResetSearchBadUi() {
  return (
    <div className="bad-ui-sample filter-reset-demo bad" aria-label="Broken filter reset preview">
      <FilterResetSearchBadPanel mode="queryWiped" idSuffix="bad-ui" />
      <p className="demo-status">A narrow Clear filters action silently wipes the search query and unrelated result state.</p>
    </div>
  );
}

function FilterResetSearchPanel({ mode, idSuffix }: { mode: FilterResetSearchMode; idSuffix: string }) {
  const showNoResults = mode === "noResultsRecovery";
  const showDraft = mode === "resetDraft";
  const showSavedSearch = mode === "savedSearchBundle";
  const showMobile = mode === "mobileReset";
  const query = mode === "clearSearch" ? "cleared intentionally" : "appeal";
  const filters = mode === "clearOne"
    ? ["Date: Last 30 days"]
    : mode === "clearAllFilters"
      ? []
      : ["Status: Open", "Team: Benefits", "Date: Last 30 days"];
  const resultCount = showNoResults ? 0 : 18 + (filters.length === 0 ? 9 : 0);
  const message: Record<FilterResetSearchMode, string> = {
    clearOne: "Clear one filter removes Status: Open only; query appeal, sort Newest, and page policy remain.",
    clearAllFilters: "Clear all filters removes filter criteria only and keeps the submitted query.",
    clearSearch: "Clear search is a separate action, so users can intentionally remove query text without clearing filters.",
    resetDraft: "Reset draft reverts pending drawer controls while applied query and filters remain unchanged.",
    noResultsRecovery: "No-results recovery offers Remove Date filter, Clear all filters, and Clear search separately.",
    savedFilterBoundary: "Saved filter applies criteria only; query appeal and sort Newest are outside the preset.",
    savedSearchBundle: "Saved search bundle visibly owns query, filters, sort, scope, and alert state before reset.",
    sortPreserved: "Sort preserved: Newest remains active after filter reset.",
    paginationPolicy: "Pagination policy: clear filters returns to page 1 by policy while preserving query and sort.",
    mobileReset: "Mobile reset clears draft filters in the drawer and returns to results with query appeal intact.",
    undoReset: "Undo reset restores the last filter set without reconstructing the search query.",
    urlState: "URL state keeps q=appeal while removing filter parameters from the address."
  };

  return (
    <div className={`filter-reset-shell is-${mode}`}>
      <div className="filter-reset-statebar" aria-label="Result state owners">
        <span><strong>Query</strong>{query}</span>
        <span><strong>Sort</strong>Newest</span>
        <span><strong>Scope</strong>Cases</span>
        <span><strong>Saved</strong>{showSavedSearch ? "Renewal risk search" : "High priority filter"}</span>
        <span><strong>Page</strong>{mode === "paginationPolicy" ? "1 by reset policy" : "3 preserved"}</span>
      </div>
      <div className="filter-reset-layout">
        <aside className={showMobile ? "filter-reset-panel is-mobile" : "filter-reset-panel"} aria-label="Filter controls">
          <div className="filter-reset-panel-heading">
            <strong>{showMobile ? "Mobile filter drawer" : "Filters"}</strong>
            <span>{showDraft ? "Draft differs from applied" : `${filters.length} applied`}</span>
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={mode !== "clearAllFilters"} readOnly />
            Status: Open
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={mode !== "clearAllFilters" && mode !== "clearOne"} readOnly />
            Team: Benefits
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={mode !== "clearAllFilters"} readOnly />
            Date: Last 30 days
          </label>
          <div className="filter-reset-actions">
            <button type="button" className="demo-button small primary">Apply filters</button>
            <button type="button" className="demo-button small">Reset draft</button>
          </div>
        </aside>
        <section className="filter-reset-results" aria-labelledby={`filter-reset-title-${idSuffix}`}>
          <div className="filter-reset-summary" aria-live="polite">
            <h3 id={`filter-reset-title-${idSuffix}`}>{resultCount} results for {query}</h3>
            <span>{message[mode]}</span>
          </div>
          <div className="filter-reset-token-row" aria-label="Visible state tokens">
            <button type="button" className="filter-reset-token query">Query: {query}</button>
            {filters.map((filter) => <button type="button" className="filter-reset-token" key={filter}>{filter} x</button>)}
            <button type="button" className="filter-reset-token sort">Sort: Newest</button>
            <button type="button" className="filter-reset-token clear">Clear filters</button>
            <button type="button" className="filter-reset-token search-clear">Clear search</button>
          </div>
          {showNoResults ? (
            <div className="filter-reset-empty" role="status">
              <strong>No results for query appeal with these filters</strong>
              <span>Choose which constraint to loosen instead of using a broad reset.</span>
              <div className="filter-reset-actions">
                <button type="button" className="demo-button small">Remove Date filter</button>
                <button type="button" className="demo-button small">Clear all filters</button>
                <button type="button" className="demo-button small">Clear search</button>
              </div>
            </div>
          ) : (
            <div className="mini-result-list">
              {["Appeal case 104", "Appeal evidence 221", "Benefits appeal 318"].map((item) => (
                <button type="button" className="pattern-row filter-reset-row" key={item}>
                  <span>{item}</span>
                  <small>Query and filter state remain reconstructable.</small>
                </button>
              ))}
            </div>
          )}
          {(mode === "undoReset" || mode === "urlState" || showSavedSearch) && (
            <div className="filter-reset-note" role="status">
              {mode === "undoReset"
                ? "Undo restores filters only; the search query was never discarded."
                : mode === "urlState"
                  ? "URL after reset: /cases?q=appeal&sort=newest; filter params removed."
                  : "This saved search owns query + filters + sort, so reset language names the whole bundle."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterResetSearchBadPanel({ mode, idSuffix }: { mode: FilterResetSearchBadMode; idSuffix: string }) {
  const copy: Record<FilterResetSearchBadMode, { title: string; body: string; query: string; sort: string; filters: string }> = {
    queryWiped: {
      title: "Clear filters",
      body: "The button removed filters and emptied the search query even though the label did not mention search.",
      query: "cleared unexpectedly",
      sort: "Newest",
      filters: "cleared"
    },
    oneChipClearsAll: {
      title: "Remove Team chip",
      body: "One chip removal cleared every filter, the query token, and the result summary.",
      query: "cleared",
      sort: "Newest",
      filters: "all removed"
    },
    mobileResetWipesSearch: {
      title: "Mobile reset",
      body: "Reset inside the mobile filter drawer wiped the submitted search on the results page.",
      query: "lost after drawer close",
      sort: "Newest",
      filters: "draft + applied cleared"
    },
    broadStartOver: {
      title: "Start over",
      body: "No-results recovery used one broad Start over action instead of scoped loosen-filter and clear-search actions.",
      query: "deleted",
      sort: "Default",
      filters: "deleted"
    },
    savedFilterWipesQuery: {
      title: "Apply saved filter",
      body: "A saved filter preset behaved like a saved search and replaced the user's query and sort.",
      query: "replaced by preset",
      sort: "Default",
      filters: "preset applied"
    },
    sortReset: {
      title: "Reset filters",
      body: "Sort order and pagination reset without being named as affected state.",
      query: "appeal",
      sort: "Default",
      filters: "cleared"
    },
    historyDeleted: {
      title: "Clear filters",
      body: "The action also deleted the recent search event and saved identity, so the query cannot be recovered.",
      query: "removed from history",
      sort: "Newest",
      filters: "cleared"
    },
    draftResetClearsApplied: {
      title: "Reset draft",
      body: "Reset draft controls also cleared already applied filters and search results.",
      query: "appeal lost",
      sort: "Newest",
      filters: "draft + applied cleared"
    }
  };
  const current = copy[mode];

  return (
    <div className={`filter-reset-shell bad is-${mode}`}>
      <div className="filter-reset-statebar bad" aria-label="Broken state owners">
        <span><strong>Query</strong>{current.query}</span>
        <span><strong>Sort</strong>{current.sort}</span>
        <span><strong>Saved</strong>{mode === "historyDeleted" ? "history deleted" : "ambiguous"}</span>
        <span><strong>Filters</strong>{current.filters}</span>
      </div>
      <div className="filter-reset-layout">
        <aside className="filter-reset-panel bad" aria-label="Broken reset controls">
          <strong>{current.title}</strong>
          <p>{current.body}</p>
          <button type="button" className="demo-button small danger">Reset</button>
        </aside>
        <section className="filter-reset-results bad" aria-labelledby={`filter-reset-bad-title-${idSuffix}`}>
          <div className="filter-reset-summary bad">
            <h3 id={`filter-reset-bad-title-${idSuffix}`}>42 generic results</h3>
            <span>Query, filters, sort, saved search, and history ownership are mixed.</span>
          </div>
          <div className="filter-reset-token-row bad" aria-label="Broken state tokens">
            <span className="filter-reset-token query">Query: {current.query}</span>
            <span className="filter-reset-token">Filters: {current.filters}</span>
            <span className="filter-reset-token sort">Sort: {current.sort}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function FilterResetSearchGoodUx() {
  const [mode, setMode] = useState<FilterResetSearchMode>("clearOne");
  const messages: Record<FilterResetSearchMode, string> = {
    clearOne: "Removed one filter while preserving query appeal and sort Newest.",
    clearAllFilters: "Cleared all filters only; search query and sort remain.",
    clearSearch: "Clear search is explicit and separate from Clear filters.",
    resetDraft: "Reset draft affects pending filter controls, not applied search results.",
    noResultsRecovery: "No-results recovery offers scoped loosen actions.",
    savedFilterBoundary: "Saved filter boundary keeps query and sort outside the preset.",
    savedSearchBundle: "Saved search bundle names query, filters, sort, scope, and alert state before reset.",
    sortPreserved: "Sort preserved after filter reset.",
    paginationPolicy: "Pagination policy is visible while query and sort remain stable.",
    mobileReset: "Mobile reset returns to results with query preserved.",
    undoReset: "Undo reset restores filter criteria without reconstructing the query.",
    urlState: "URL state removes filter params and keeps q=appeal."
  };

  return (
    <div className="quality-example filter-reset-demo">
      <FilterResetSearchPanel mode={mode} idSuffix="good-ux" />
      <div className="demo-row filter-reset-controls">
        {filterResetGoodModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{messages[mode]}</p>
    </div>
  );
}

function FilterResetSearchBadUx() {
  const [mode, setMode] = useState<FilterResetSearchBadMode>("queryWiped");
  const messages: Record<FilterResetSearchBadMode, string> = {
    queryWiped: "Clear filters wiped the unrelated search query.",
    oneChipClearsAll: "Removing one chip cleared every result-state owner.",
    mobileResetWipesSearch: "Mobile reset wiped search when it should have reset draft filters only.",
    broadStartOver: "Broad start over destroyed useful no-results context.",
    savedFilterWipesQuery: "Saved filter application incorrectly replaced query and sort.",
    sortReset: "Sort reset was hidden inside a filter reset.",
    historyDeleted: "Filter reset deleted search history and saved identity.",
    draftResetClearsApplied: "Reset draft cleared already applied query and filters."
  };

  return (
    <div className={`quality-example filter-reset-bad-ux is-${mode}`}>
      <FilterResetSearchBadPanel mode={mode} idSuffix="bad-ux" />
      <div className="demo-row filter-reset-controls">
        {filterResetBadModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{messages[mode]}</p>
    </div>
  );
}

function FilterChipsGoodUx() {
  const chips: FilterChipItem[] = [
    { id: "open", label: "Open", category: "Status" },
    { id: "urgent", label: "Urgent", category: "Priority" },
    { id: "appeal", label: "Appeal", category: "Type" },
    { id: "benefits", label: "Benefits", category: "Team" },
    { id: "housing", label: "Housing", category: "Team" },
    { id: "recent", label: "Last 30 days", category: "Date" }
  ];
  const cases = [
    { name: "Appeal case 104", status: "Open", urgent: true, type: "Appeal", team: "Benefits", recent: true },
    { name: "Housing case 221", status: "Open", urgent: false, type: "Review", team: "Housing", recent: true },
    { name: "Urgent housing appeal 318", status: "Open", urgent: true, type: "Appeal", team: "Housing", recent: false },
    { name: "Closed benefit appeal 087", status: "Closed", urgent: false, type: "Appeal", team: "Benefits", recent: true },
    { name: "Benefit check 144", status: "Open", urgent: false, type: "Check", team: "Benefits", recent: false }
  ];
  const [selected, setSelected] = useState<Array<FilterChipItem["id"]>>(["open", "urgent"]);
  const [query, setQuery] = useState("case");
  const [sort, setSort] = useState("Newest");
  const [message, setMessage] = useState("Selected chips stay in their original order while the result count updates.");
  const activeChips = chips.filter((chip) => selected.includes(chip.id));
  const filteredCases = cases.filter((item) => {
    const matchesQuery = !query.trim() || item.name.toLowerCase().includes(query.trim().toLowerCase()) || item.team.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery
      && (!selected.includes("open") || item.status === "Open")
      && (!selected.includes("urgent") || item.urgent)
      && (!selected.includes("appeal") || item.type === "Appeal")
      && (!selected.includes("benefits") || item.team === "Benefits")
      && (!selected.includes("housing") || item.team === "Housing")
      && (!selected.includes("recent") || item.recent);
  });
  const sortedCases = [...filteredCases].sort((a, b) => sort === "Newest" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));

  const toggleChip = (chip: FilterChipItem) => {
    setSelected((current) => {
      const next = current.includes(chip.id)
        ? current.filter((id) => id !== chip.id)
        : [...current, chip.id];
      setMessage(`${chip.category}: ${chip.label} ${current.includes(chip.id) ? "removed" : "selected"}; query and sort are preserved.`);
      return next;
    });
  };
  const removeChip = (chip: FilterChipItem) => {
    setSelected((current) => current.filter((id) => id !== chip.id));
    setMessage(`Removed ${chip.category}: ${chip.label}; focus can continue through the remaining applied chips.`);
  };
  const clearAll = () => {
    setSelected([]);
    setMessage(`Cleared chips only; query "${query}" and ${sort.toLowerCase()} sort are still set.`);
  };

  return (
    <div className="quality-example filter-chips-demo">
      <div className="filter-chip-controls">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>Newest</option>
            <option>A-Z</option>
          </select>
        </label>
      </div>
      <div className="filter-chip-row" aria-label="Quick filters">
        {chips.map((chip) => {
          const pressed = selected.includes(chip.id);
          return (
            <button
              type="button"
              className={pressed ? "filter-chip is-selected" : "filter-chip"}
              aria-pressed={pressed}
              key={chip.id}
              onClick={() => toggleChip(chip)}
            >
              {pressed ? "✓ " : ""}{chip.label}
            </button>
          );
        })}
      </div>
      <div className="filter-chip-result-panel" aria-label="Filtered cases">
        <div className="filter-chip-summary" aria-live="polite">
          <strong>{sortedCases.length} cases found</strong>
          <span>Query: {query || "all"} - Sort: {sort} - {activeChips.length} chips selected</span>
        </div>
        {activeChips.length > 0 && (
          <div className="filter-chip-applied-row" aria-label="Applied filter chips">
            {activeChips.map((chip) => (
              <button
                type="button"
                className="filter-chip applied"
                key={chip.id}
                onClick={() => removeChip(chip)}
                aria-label={`Remove ${chip.category}: ${chip.label} filter`}
              >
                {chip.category}: {chip.label} ×
              </button>
            ))}
            <button type="button" className="filter-chip clear" onClick={clearAll}>Clear all</button>
          </div>
        )}
        {sortedCases.length > 0 ? (
          <div className="mini-result-list">
            {sortedCases.map((item) => (
              <button type="button" className="pattern-row filter-chip-result-row" key={item.name}>
                <span>{item.name}</span>
                <small>{item.status} - {item.type} - {item.team}{item.urgent ? " - urgent" : ""}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="demo-empty compact-empty" role="status">
            <h3>No cases match these chips</h3>
            <p>Remove one restrictive chip or clear all chips.</p>
            <button type="button" className="demo-button small primary" onClick={clearAll}>Clear all chips</button>
          </div>
        )}
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type FilterPanelState = {
  open: boolean;
  appeal: boolean;
  urgent: boolean;
  recent: boolean;
};

function FilterPanelGoodUx() {
  const records = [
    { name: "Appeal case 104", status: "Open", type: "Appeal", urgent: true, recent: true, team: "Benefits" },
    { name: "Housing review 221", status: "Open", type: "Review", urgent: false, recent: true, team: "Housing" },
    { name: "Urgent appeal 318", status: "Open", type: "Appeal", urgent: true, recent: false, team: "Housing" },
    { name: "Closed appeal 087", status: "Closed", type: "Appeal", urgent: false, recent: true, team: "Benefits" },
    { name: "Benefit check 144", status: "Open", type: "Check", urgent: false, recent: false, team: "Benefits" }
  ];
  const defaultFilters: FilterPanelState = { open: true, appeal: false, urgent: false, recent: true };
  const [panelOpen, setPanelOpen] = useState(true);
  const [draft, setDraft] = useState<FilterPanelState>(defaultFilters);
  const [applied, setApplied] = useState<FilterPanelState>(defaultFilters);
  const [query, setQuery] = useState("case");
  const [sort, setSort] = useState("Newest");
  const [message, setMessage] = useState("Two filters are applied and summarized above the case results.");
  const activeLabels = [
    applied.open ? { key: "open" as const, label: "Status: Open" } : null,
    applied.appeal ? { key: "appeal" as const, label: "Type: Appeal" } : null,
    applied.urgent ? { key: "urgent" as const, label: "Priority: Urgent" } : null,
    applied.recent ? { key: "recent" as const, label: "Date: Last 30 days" } : null
  ].filter((item): item is { key: keyof FilterPanelState; label: string } => Boolean(item));
  const draftCount = Object.values(draft).filter(Boolean).length;
  const appliedCount = activeLabels.length;
  const results = records.filter((record) => {
    const matchesQuery = !query.trim() || record.name.toLowerCase().includes(query.trim().toLowerCase()) || record.team.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery
      && (!applied.open || record.status === "Open")
      && (!applied.appeal || record.type === "Appeal")
      && (!applied.urgent || record.urgent)
      && (!applied.recent || record.recent);
  });
  const sortedResults = [...results].sort((a, b) => sort === "Newest" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));

  const setDraftValue = (key: keyof FilterPanelState, value: boolean) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setMessage("Draft filter selection changed; results still show the last applied state until Apply filters.");
  };
  const applyFilters = () => {
    setApplied(draft);
    setPanelOpen(false);
    setMessage(`Applied ${draftCount} filters; focus returns to the result summary and the collapsed trigger shows the count.`);
  };
  const clearFilter = (key: keyof FilterPanelState) => {
    setDraft((current) => ({ ...current, [key]: false }));
    setApplied((current) => ({ ...current, [key]: false }));
    setMessage("Removed one applied filter without changing the search query or sort order.");
  };
  const clearAll = () => {
    const empty = { open: false, appeal: false, urgent: false, recent: false };
    setDraft(empty);
    setApplied(empty);
    setMessage(`Cleared filters only; query "${query}" and ${sort.toLowerCase()} sort are preserved.`);
  };

  return (
    <div className="quality-example filter-panel-demo">
      <div className="filter-panel-toolbar">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>Newest</option>
            <option>A-Z</option>
          </select>
        </label>
        <button type="button" className="filter-panel-trigger" aria-expanded={panelOpen} onClick={() => setPanelOpen((open) => !open)}>
          Filters ({appliedCount})
        </button>
      </div>
      <div className={panelOpen ? "filter-panel-shell" : "filter-panel-shell collapsed"}>
        {panelOpen ? (
          <aside className="filter-panel-body" aria-label="Case filters">
            <div className="filter-panel-heading">
              <strong>Filters</strong>
              <span>{draftCount} selected</span>
            </div>
            <fieldset className="quality-fieldset filter-panel-fieldset">
              <legend>Status</legend>
              <label className="checkbox-label">
                <input type="checkbox" checked={draft.open} onChange={(event) => setDraftValue("open", event.target.checked)} />
                Open cases
              </label>
            </fieldset>
            <fieldset className="quality-fieldset filter-panel-fieldset">
              <legend>Case type</legend>
              <label className="checkbox-label">
                <input type="checkbox" checked={draft.appeal} onChange={(event) => setDraftValue("appeal", event.target.checked)} />
                Appeals
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={draft.urgent} onChange={(event) => setDraftValue("urgent", event.target.checked)} />
                Urgent priority
              </label>
            </fieldset>
            <fieldset className="quality-fieldset filter-panel-fieldset">
              <legend>Date</legend>
              <label className="checkbox-label">
                <input type="checkbox" checked={draft.recent} onChange={(event) => setDraftValue("recent", event.target.checked)} />
                Last 30 days
              </label>
            </fieldset>
            <div className="filter-panel-actions">
              <button type="button" className="demo-button small primary" onClick={applyFilters}>Apply filters</button>
              <button type="button" className="demo-button small" onClick={clearAll}>Clear all</button>
            </div>
          </aside>
        ) : (
          <div className="filter-panel-collapsed" role="status">
            Panel closed - {appliedCount} active filters
          </div>
        )}
        <section className="filter-panel-results" aria-label="Filtered case results">
          <div className="filter-panel-summary" tabIndex={-1}>
            <strong>{sortedResults.length} cases found</strong>
            <span>Query: {query || "all"} - Sort: {sort} - {appliedCount} filters active</span>
          </div>
          {activeLabels.length > 0 && (
            <div className="filter-panel-chip-row" aria-label="Applied filters">
              {activeLabels.map((item) => (
                <button type="button" className="filter-panel-chip" key={item.key} onClick={() => clearFilter(item.key)}>
                  {item.label} x
                </button>
              ))}
              <button type="button" className="filter-panel-chip clear" onClick={clearAll}>Clear all</button>
            </div>
          )}
          {sortedResults.length > 0 ? (
            <div className="mini-result-list">
              {sortedResults.map((record) => (
                <button type="button" className="pattern-row filter-panel-result-row" key={record.name}>
                  <span>{record.name}</span>
                  <small>{record.status} - {record.type} - {record.team}{record.urgent ? " - urgent" : ""}</small>
                </button>
              ))}
            </div>
          ) : (
            <div className="demo-empty compact-empty" role="status">
              <h3>No cases match these filters</h3>
              <button type="button" className="demo-button small primary" onClick={clearAll}>Clear all filters</button>
            </div>
          )}
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function NoResultsRecoveryGoodUx({ meta }: { meta: PatternMeta }) {
  const [query, setQuery] = useState("wizard");
  const [archivedOnly, setArchivedOnly] = useState(true);
  const records = meta.options;
  const normalizedQuery = query.trim().toLowerCase();
  const results = records.filter((item) => item.toLowerCase().includes(normalizedQuery) && !archivedOnly);
  const hasCriteria = Boolean(normalizedQuery) || archivedOnly;

  const clearAll = () => {
    setQuery("");
    setArchivedOnly(false);
  };

  return (
    <div className="quality-example">
      <label>
        <span>{meta.field}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" checked={archivedOnly} onChange={(event) => setArchivedOnly(event.target.checked)} />
        archived only
      </label>
      {hasCriteria && (
        <div className="demo-row" aria-label="Active criteria">
          {normalizedQuery && (
            <button type="button" className="demo-button small" onClick={() => setQuery("")}>
              Query: {query} x
            </button>
          )}
          {archivedOnly && (
            <button type="button" className="demo-button small" onClick={() => setArchivedOnly(false)}>
              Archived only x
            </button>
          )}
        </div>
      )}
      <p className="demo-status" aria-live="polite">{results.length} results</p>
      {results.length > 0 ? (
        <div className="mini-result-list">
          {results.map((item) => <button type="button" className="pattern-row" key={item}>{item}</button>)}
        </div>
      ) : (
        <div className="demo-empty compact-empty" role="status">
          <h3>No matches for current criteria</h3>
          <p>Try removing archived only or search for "modal".</p>
          <div className="demo-row">
            <button type="button" className="demo-button small" onClick={() => setArchivedOnly(false)}>Remove filter</button>
            <button type="button" className="demo-button small" onClick={() => setQuery("modal")}>Try modal</button>
            <button type="button" className="demo-button small primary" onClick={clearAll}>Clear all</button>
          </div>
        </div>
      )}
    </div>
  );
}

function BasicSearchGoodUx({ meta }: { meta: PatternMeta }) {
  const [draftQuery, setDraftQuery] = useState("security");
  const [submittedQuery, setSubmittedQuery] = useState("security");
  const query = submittedQuery.trim().toLowerCase();
  const results = query
    ? meta.options.filter((item) => item.toLowerCase().includes(query))
    : meta.options;

  return (
    <form
      className="quality-example"
      role="search"
      aria-label={`${meta.subject} search`}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmittedQuery(draftQuery);
      }}
    >
      <label>
        <span>{meta.field}</span>
        <input value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} />
      </label>
      <div className="demo-row">
        <button type="submit" className="demo-button small primary">Search</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setDraftQuery("");
            setSubmittedQuery("");
          }}
        >
          Clear
        </button>
      </div>
      <p className="demo-status" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}{submittedQuery ? ` for "${submittedQuery}"` : ""}
      </p>
      {results.length > 0 ? (
        <div className="mini-result-list">
          {results.map((item) => <button type="button" className="pattern-row" key={item}>{item}</button>)}
        </div>
      ) : (
        <div className="demo-empty compact-empty" role="status">
          <h3>No matches</h3>
          <button type="button" className="demo-button small" onClick={() => setDraftQuery("")}>Revise query</button>
        </div>
      )}
    </form>
  );
}

function TypeaheadBadUx() {
  const [query, setQuery] = useState("ca");
  const [committed, setCommitted] = useState("Case 104 - Benefit appeal");
  const [rows, setRows] = useState(["Case 104 - Benefit appeal", "Case 221 - Housing evidence"]);
  const [message, setMessage] = useState("The first matching row is treated as if the user already chose it.");

  return (
    <div className="quality-example typeahead-demo">
      <label>
        <span>Search cases</span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setMessage("Every keystroke sends a remote request, even one-character queries.");
          }}
          aria-label="Broken typeahead"
        />
      </label>
      <div className="typeahead-status-row bad">
        <span>Committed value: {committed}</span>
        <em>No loading, query label, minimum length, or stale-response guard</em>
      </div>
      <div className="typeahead-result-list bad" aria-label="Broken typeahead results">
        {rows.map((row, index) => (
          <button
            type="button"
            className={index === 0 ? "typeahead-result is-active" : "typeahead-result"}
            key={row}
            onClick={() => {
              setCommitted(row);
              setMessage(`Clicked "${row}", but the UI does not distinguish preview from committed selection.`);
            }}
          >
            <span>{row}</span>
            <em>{index === 0 ? "Auto-filled top hit" : "Stale result may not match current query"}</em>
          </button>
        ))}
      </div>
      <div className="typeahead-bad-actions">
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setQuery("c");
            setCommitted("Case 104 - Benefit appeal");
            setMessage("A one-letter query triggered remote work and committed the top result.");
          }}
        >
          Type c
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setQuery("case");
            setRows(["Calendar hearing guide", "Claim renewal notice"]);
            setCommitted("Calendar hearing guide");
            setMessage("A slow ca response overwrote the newer case result list.");
          }}
        >
          Slow response wins
        </button>
        <button
          type="button"
          className="demo-button small danger"
          onClick={() => {
            const topHit = rows[0] ?? "Unknown hit";
            setQuery(topHit);
            setCommitted(topHit);
            setMessage("The first result replaced the typed query before the user selected anything.");
          }}
        >
          Auto-fill top hit
        </button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SearchBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "browse-by-category") return <BrowseByCategoryBadUx />;
  if (patternId === "advanced-search") return <AdvancedSearchBadUx />;
  if (patternId === "query-correction") return <QueryCorrectionBadUx />;
  if (patternId === "recommendations") return <RecommendationsBadUx />;
  if (patternId === "recently-searched") return <RecentlySearchedBadUx />;
  if (patternId === "search-history") return <SearchHistoryBadUx />;
  if (patternId === "search-scope-selector") return <SearchScopeSelectorBadUx />;
  if (patternId === "search-result-highlighting") return <SearchResultHighlightingBadUx />;
  if (patternId === "saved-filter") return <SavedFilterBadUx />;
  if (patternId === "saved-search") return <SavedSearchBadUx />;
  if (patternId === "sort-controls") return <SortControlsBadUx />;
  if (patternId === "filter-chips") return <FilterChipsBadUx />;
  if (patternId === "filter-panel") return <FilterPanelBadUx />;
  if (patternId === "filter-reset-that-clears-unrelated-search") return <FilterResetSearchBadUx />;
  if (patternId === "typeahead") return <TypeaheadBadUx />;
  if (patternId === "combobox") return <ComboboxBadUx />;

  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const hasResults = query.toLowerCase() !== "zzz";

  return (
    <div className="quality-example">
      <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={`${meta.field} without feedback`} placeholder={patternId === "command-palette" ? "command" : "search"} />
      <button type="button" className="demo-button small" onClick={() => setSubmitted(true)}>Go</button>
      {submitted && hasResults && <p className="demo-status">{short(meta.options[0])}</p>}
      {submitted && !hasResults && <p className="demo-status">Nothing.</p>}
    </div>
  );
}

function BrowseByCategoryBadUx() {
  const [selected, setSelected] = useState("CX Ops");
  const [message, setMessage] = useState("Category names are internal and overlap, so users cannot predict the contents.");

  const chooseEmpty = () => {
    setSelected("Other");
    setMessage("Other opens as an empty category with no parent, sibling, or search recovery.");
  };

  return (
    <div className="quality-example browse-category-demo">
      <div className="browse-category-bad-grid">
        {["CX Ops", "Services", "Resources", "Other"].map((item) => (
          <button
            type="button"
            className={item === selected ? "browse-category-bad-card is-active" : "browse-category-bad-card"}
            onClick={item === "Other" ? chooseEmpty : () => {
              setSelected(item);
              setMessage(`${item} selected, but the label still does not explain what users will find.`);
            }}
            key={item}
          >
            <strong>{item}</strong>
            <span>{item === "Other" ? "0 things" : "Team-owned bucket"}</span>
          </button>
        ))}
      </div>
      <div className="browse-category-bad-panel">
        <strong>{selected === "Other" ? "0 links" : `${selected} links`}</strong>
        <span>No description, no child categories, no user-facing examples, and no route back to the taxonomy.</span>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AdvancedSearchBadUx() {
  const [query, setQuery] = useState('status=open title:"appeal');
  const [field, setField] = useState("created");
  const [operator, setOperator] = useState("contains");
  const [message, setMessage] = useState("The raw query has an unmatched quote, but the interface has not flagged it.");
  const [summary, setSummary] = useState("Preview unknown");

  const runBrokenSearch = () => {
    setSummary("0 results");
    setMessage("The malformed query ran as if zero results were a valid answer.");
  };

  const hideSyntax = () => {
    setQuery("");
    setSummary("18 results");
    setMessage("The product hid the generated syntax and kept an old count preview.");
  };

  return (
    <div className="quality-example advanced-search-demo">
      <div className="advanced-search-toolbar bad">
        <label>
          <span>Raw query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="demo-button small" onClick={runBrokenSearch}>Run</button>
      </div>
      <div className="advanced-search-bad-grid">
        <label>
          <span>Field</span>
          <select value={field} onChange={(event) => setField(event.target.value)}>
            <option>created</option>
            <option>owner_id</option>
            <option>idx_text</option>
          </select>
        </label>
        <label>
          <span>Operator</span>
          <select value={operator} onChange={(event) => setOperator(event.target.value)}>
            <option>contains</option>
            <option>maybe</option>
            <option>op_7</option>
          </select>
        </label>
        <button type="button" className="advanced-search-bad-card" onClick={hideSyntax}>
          <strong>Hide syntax</strong>
          <span>Deletes the fielded query but leaves the old preview.</span>
        </button>
      </div>
      <div className="advanced-search-bad-panel">
        <strong>{summary}</strong>
        <span>{field} {operator} appeal - incompatible pair accepted with no repair copy.</span>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function QueryCorrectionBadUx() {
  const [query, setQuery] = useState("benifit appeel");
  const [visibleQuery, setVisibleQuery] = useState("benifit appeel");
  const [summary, setSummary] = useState("0 results");
  const [message, setMessage] = useState("The typo query returns nothing, but no did-you-mean path is offered.");

  const silentlyCorrect = () => {
    setQuery("benefit appeal");
    setVisibleQuery("benefit appeal");
    setSummary("22 results");
    setMessage("The query was silently rewritten; the original benifit appeel is gone.");
  };

  const overCorrectCode = () => {
    setQuery("AB-1047");
    setVisibleQuery("about 1047");
    setSummary("14 results");
    setMessage("A policy code was overcorrected to common words with no exact-search option.");
  };

  return (
    <div className="quality-example query-correction-demo">
      <div className="query-correction-toolbar bad">
        <label>
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="demo-button small" onClick={silentlyCorrect}>Go</button>
        <button type="button" className="demo-button small" onClick={overCorrectCode}>Search code</button>
      </div>
      <div className="query-correction-bad-panel">
        <strong>{summary}</strong>
        <span>Visible query: {visibleQuery}</span>
      </div>
      <div className="query-correction-bad-list" aria-label="Misleading correction results">
        {["Appeal benefits", "Benefit appeal", "About filing"].map((item) => (
          <button type="button" className="pattern-row" key={item}>{item}</button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function RecommendationsBadUx() {
  const [message, setMessage] = useState("The list mixes recommendations, ads, and fake recents with no visible basis.");
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="quality-example recommendations-demo">
      <div className="recommendations-toolbar bad">
        <div>
          <span>Picked for you</span>
          <strong>Top choices</strong>
        </div>
        <button type="button" className="demo-button small" onClick={() => {
          setDismissed(true);
          setMessage("The item vanished, but the UI does not say whether feedback was recorded or how to undo it.");
        }}>
          Hide
        </button>
      </div>
      <div className="recommendations-list bad" aria-label="Ambiguous recommendation list">
        {!dismissed && (
          <article className="recommendation-card bad">
            <span>Recent</span>
            <strong>Private loan offer</strong>
            <small>Sponsored, but not disclosed until after click.</small>
            <em>No reason available</em>
          </article>
        )}
        <article className="recommendation-card bad">
          <span>Recommended</span>
          <strong>Expired housing grant</strong>
          <small>Unavailable item still ranks first.</small>
          <em>Based on unknown activity</em>
        </article>
        <article className="recommendation-card bad">
          <span>Recently viewed</span>
          <strong>Debt advice appointment</strong>
          <small>User never opened this item.</small>
          <em>No control over personalization</em>
        </article>
      </div>
      <div className="recommendations-bad-panel">
        <strong>Why these?</strong>
        <span>You might like them. No dismissal reason, sponsored disclosure, fallback label, or data scope.</span>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function RecentlySearchedBadUx() {
  const [message, setMessage] = useState("Recent searches are mixed with saved searches, ads, and viewed records.");
  const [shared, setShared] = useState(false);
  const badItems = shared
    ? ["Sponsored claim help", "Atlas Packaging", "Saved: Open cases", "Aditi health appeal", "benefit appeal deadline"]
    : ["Sponsored claim help", "Atlas Packaging", "Saved: Open cases", "benefit appeal deadline"];

  return (
    <div className="quality-example recent-searches-demo">
      <div className="recent-search-entry bad">
        <input aria-label="Search field with unclear history" defaultValue="benefit" />
        <button type="button" className="demo-button small" onClick={() => setMessage("The new query ran but the UI does not say whether it was stored or where.")}>Go</button>
      </div>
      <div className="recent-search-list bad" aria-label="Ambiguous recent list">
        <strong>Recent</strong>
        {badItems.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => {
              if (item === "Atlas Packaging") setMessage("A viewed supplier record is shown as if it were a search query.");
              else if (item.startsWith("Saved:")) setMessage("A saved search object is mixed into passive search history.");
              else if (item.includes("Aditi")) setMessage("Another user's sensitive query appears with no account or device scope.");
              else if (item.startsWith("Sponsored")) setMessage("Promoted content is styled as search history.");
              else setMessage("There is no remove-one, clear-all, timestamp, or scope control for this query.");
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="recent-search-preview bad">
        <strong>No controls</strong>
        <span>History status, account scope, timestamps, result scope, remove, and clear actions are missing.</span>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setShared(true);
            setMessage("Shared-device search appeared unexpectedly and still cannot be removed.");
          }}
        >
          Sync shared device
        </button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SearchHistoryBadUx() {
  const [message, setMessage] = useState("History combines passive queries, saved searches, viewed files, and promoted content.");
  const [items, setItems] = useState(["Saved: Renewal risk", "Viewed: debt.pdf", "Sponsored claim help", "Aditi health appeal"]);
  const [paused, setPaused] = useState(false);

  const clearEverything = () => {
    setItems([]);
    setMessage("Clear all removed the whole mixed list, including saved searches and viewed records.");
  };

  const pauseOnly = () => {
    setPaused(true);
    setMessage("History is labelled paused, but old sensitive entries remain visible and no deletion path is explained.");
  };

  return (
    <div className="quality-example search-history-demo">
      <div className="search-history-bad-panel">
        <strong>{paused ? "History paused" : "History"}</strong>
        {items.length > 0 ? items.map((item) => <span key={item}>{item}</span>) : <span>No items. Saved data may also be gone.</span>}
      </div>
      <div className="search-history-bad-actions">
        <button type="button" className="demo-button small danger" onClick={clearEverything}>Clear all</button>
        <button type="button" className="demo-button small" onClick={pauseOnly}>Pause</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setItems((current) => [...current, "shared kiosk benefits query"]);
            setMessage("A shared-device query appeared with no account, product, or device scope.");
          }}
        >
          Sync device
        </button>
      </div>
      <div className="search-history-bad-panel">
        <strong>No scope</strong>
        <span>No product, date range, account, retention, or affected-data count before deletion.</span>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SearchScopeSelectorBadUx() {
  const [query, setQuery] = useState("appeal");
  const [scope, setScope] = useState("All");
  const [summary, setSummary] = useState("14 results in Current site");
  const [message, setMessage] = useState("Scope is hidden once the user types, so results look broader than they are.");

  const switchScopeBadly = () => {
    setScope("Org");
    setQuery("");
    setSummary("14 results in Current site");
    setMessage("Switching scope cleared the query and kept the stale Current site result summary.");
  };

  const runHiddenSearch = () => {
    setSummary("0 results");
    setMessage("The UI reports zero results without saying it searched only the current channel.");
  };

  return (
    <div className="quality-example search-scope-demo">
      <div className="search-scope-toolbar bad">
        <label>
          <span>Search</span>
          <input value={query} placeholder="Search this site" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select value={scope} onChange={(event) => setScope(event.target.value)} aria-label="Internal scope">
          <option>All</option>
          <option>Org</option>
          <option>idx-4</option>
        </select>
        <button type="button" className="demo-button small" onClick={runHiddenSearch}>Go</button>
      </div>
      <div className="search-scope-bad-grid">
        <button type="button" className="search-scope-bad-card" onClick={switchScopeBadly}>
          <strong>Org</strong>
          <span>Clears query and still says Current site.</span>
        </button>
        <button type="button" className="search-scope-bad-card" onClick={runHiddenSearch}>
          <strong>idx-4</strong>
          <span>Internal source name with no corpus explanation.</span>
        </button>
      </div>
      <div className="search-scope-summary bad">
        <strong>{summary}</strong>
        <span>No visible query-scope pairing, unavailable reason, or broaden-search path.</span>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SearchResultHighlightingBadUx() {
  const [query, setQuery] = useState("benefits appeal");
  const [staleQuery, setStaleQuery] = useState("renewal");
  const [message, setMessage] = useState("The result cards are tinted, but users cannot tell which words matched.");

  const changeQueryWithoutUpdating = () => {
    setQuery("housing benefit");
    setMessage("The query changed, but old renewal highlights stayed on the result cards.");
  };

  const markAdTerm = () => {
    setStaleQuery("sponsored");
    setMessage("A sponsored label is highlighted as if it explains query relevance.");
  };

  return (
    <div className="quality-example search-highlight-demo">
      <div className="search-highlight-toolbar bad">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="demo-button small" onClick={changeQueryWithoutUpdating}>Change query</button>
        <button type="button" className="demo-button small" onClick={markAdTerm}>Highlight ad term</button>
      </div>
      <div className="search-highlight-results bad" aria-label="Misleading highlighted results">
        <article className="search-highlight-result bad">
          <span className="search-highlight-bad-badge">{staleQuery}</span>
          <strong>Renewal notice</strong>
          <p>The whole result card is washed with color, so there is no field label, snippet boundary, or exact matched word.</p>
        </article>
        <article className="search-highlight-result bad">
          <span className="search-highlight-bad-badge">sponsored</span>
          <strong>Benefits partner offer</strong>
          <p>A business label is emphasized like a search match even when it did not come from the submitted query.</p>
        </article>
        <article className="search-highlight-result bad stale">
          <span className="search-highlight-bad-badge">old query</span>
          <strong>Appeal case checklist</strong>
          <p>Previous highlighted words remain after the query, filters, or no-results state changed.</p>
        </article>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SavedFilterBadUx() {
  const [query, setQuery] = useState("appeal");
  const [sort, setSort] = useState("Newest");
  const [savedRows, setSavedRows] = useState(["Case 104", "Case 221", "Case 318", "Case 410"]);
  const [message, setMessage] = useState("The saved item does not say whether it stores criteria, rows, query, or sort.");

  const saveRows = () => {
    setSavedRows((current) => current.slice(0, 2));
    setMessage("Save captured two static rows instead of filter criteria, so future matching cases are excluded.");
  };

  const applyAmbiguous = () => {
    setQuery("");
    setSort("Default");
    setMessage("Applying Old cleared the search query and reset sort, even though the saved object was labeled as a filter.");
  };

  return (
    <div className="quality-example saved-filter-demo">
      <div className="saved-filter-toolbar bad">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>Sort</span>
          <input value={sort} onChange={(event) => setSort(event.target.value)} />
        </label>
        <button type="button" className="saved-filter-save-bad" onClick={saveRows}>Save</button>
      </div>
      <div className="saved-filter-layout">
        <aside className="saved-filter-list bad" aria-label="Ambiguous saved filters">
          {["Mine", "Old", "Team"].map((item) => (
            <button type="button" key={item} onClick={applyAmbiguous}>{item}</button>
          ))}
        </aside>
        <section className="saved-filter-panel bad" aria-label="Static filter snapshot">
          <div className="saved-filter-summary bad">
            <strong>{savedRows.length} saved rows</strong>
            <span>No criteria, owner, visibility, invalid-field state, or query/sort boundary.</span>
          </div>
          <div className="mini-result-list">
            {savedRows.map((row) => <button type="button" className="pattern-row" key={row}>{row}</button>)}
          </div>
          <button type="button" className="demo-button small" onClick={applyAmbiguous}>Apply Old</button>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SavedSearchBadUx() {
  const [savedRows, setSavedRows] = useState(["Case 104", "Case 221", "Case 318"]);
  const [query, setQuery] = useState("owner:me renewal");
  const [message, setMessage] = useState("The star saved a static result snapshot with no criteria or owner.");

  const saveSnapshot = () => {
    setSavedRows((current) => current.slice(0, 2));
    setMessage("Saved search now contains only two old row IDs; new matching cases will not appear.");
  };

  const overwriteShared = () => {
    setQuery("");
    setMessage("A temporary change overwrote the shared search and erased its query.");
  };

  return (
    <div className="quality-example saved-search-demo">
      <div className="saved-search-toolbar bad">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="saved-search-star" onClick={saveSnapshot}>★</button>
      </div>
      <div className="saved-search-layout">
        <aside className="saved-search-list bad" aria-label="Ambiguous saved list">
          {["Saved", "Recent", "Filter 1"].map((item) => (
            <button type="button" key={item}>{item}</button>
          ))}
        </aside>
        <section className="saved-search-panel bad" aria-label="Static saved results">
          <div className="saved-search-summary bad">
            <strong>{savedRows.length} saved rows</strong>
            <span>No saved criteria, owner, visibility, or alert schedule.</span>
          </div>
          <div className="mini-result-list">
            {savedRows.map((row) => <button type="button" className="pattern-row" key={row}>{row}</button>)}
          </div>
          <button type="button" className="demo-button small" onClick={overwriteShared}>Overwrite shared search</button>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SortControlsBadUx() {
  const [query, setQuery] = useState("case");
  const [sort, setSort] = useState("Newest");
  const [message, setMessage] = useState("Sort values are vague and some options are really filters.");
  const [rows, setRows] = useState([
    { name: "Case 104", date: "2/20/2026", amount: "$1,400" },
    { name: "Case 221", date: "10/1/2025", amount: "$900" },
    { name: "Case 318", date: "9/5/2026", amount: "$700" }
  ]);

  const applyBadSort = (next: string) => {
    setSort(next);
    if (next === "Last 30 days" || next === "Open only") {
      setRows((current) => current.slice(0, 2));
      setMessage(`${next} changed which records appear, but it is hidden inside Sort.`);
      return;
    }
    if (next === "Date") {
      setRows((current) => [...current].sort((a, b) => a.date.localeCompare(b.date)));
      setMessage("Dates were sorted as display strings, so chronological order is wrong.");
      return;
    }
    setRows((current) => [...current].reverse());
    setMessage("Only the visible page changed order; the whole result set was not reordered.");
  };

  const clearBadly = () => {
    setQuery("");
    setSort("A-Z");
    setMessage("Changing sort also cleared the search query.");
  };

  return (
    <div className="quality-example sort-controls-demo">
      <div className="sort-controls-grid bad">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => applyBadSort(event.target.value)}>
            <option>Newest</option>
            <option>Date</option>
            <option>Last 30 days</option>
            <option>Open only</option>
            <option>A-Z</option>
          </select>
        </label>
      </div>
      <div className="sort-result-panel bad">
        <div className="sort-summary bad">
          <strong>{rows.length} records on this page</strong>
          <span>Query: {query || "cleared"} - Sort: {sort}</span>
        </div>
        <table className="sort-demo-table bad">
          <thead>
            <tr>
              <th>Case</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.name}-${row.date}`}>
                <td>{row.name}</td>
                <td>{row.date}</td>
                <td>{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="demo-button small" onClick={clearBadly}>Apply sort</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function FilterPanelBadUx() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hiddenApplied, setHiddenApplied] = useState(3);
  const [query, setQuery] = useState("case");
  const [sort, setSort] = useState("Newest");
  const [message, setMessage] = useState("Three filters are active, but the closed button does not show that results are constrained.");

  return (
    <div className="quality-example filter-panel-demo">
      <div className="filter-panel-toolbar bad">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>Newest</option>
            <option>A-Z</option>
          </select>
        </label>
        <button type="button" className="filter-panel-trigger bad" aria-expanded={drawerOpen} onClick={() => setDrawerOpen((open) => !open)}>
          Filters
        </button>
      </div>
      <div className="filter-panel-shell bad">
        {drawerOpen && (
          <aside className="filter-panel-body bad" aria-label="Hidden filters">
            <div className="filter-panel-heading">
              <strong>Filters</strong>
              <span>No applied-state summary</span>
            </div>
            {["Open", "Archived", "Urgent"].map((item) => (
              <label className="checkbox-label" key={item}>
                <input type="checkbox" defaultChecked />
                {item}
              </label>
            ))}
            <div className="filter-panel-actions">
              <button
                type="button"
                className="demo-button small"
                onClick={() => setMessage("Checkboxes changed in the drawer, but the 42-record result summary still describes the previous state.")}
              >
                Apply filters
              </button>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setHiddenApplied(0);
                  setQuery("");
                  setSort("A-Z");
                  setMessage("Clear all removed filters but also erased the query and changed the sort order.");
                }}
              >
                Clear all
              </button>
            </div>
          </aside>
        )}
        <section className="filter-panel-results bad" aria-label="Stale case results">
          <div className="filter-panel-summary bad">
            <strong>42 records</strong>
            <span>{hiddenApplied} hidden filters; query {query || "cleared"}; sort {sort}</span>
          </div>
          <div className="mini-result-list">
            {["Case 104", "Case 221", "Case 318"].map((item) => (
              <button type="button" className="pattern-row" key={item}>{item}</button>
            ))}
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function FilterChipsBadUx() {
  const [chips, setChips] = useState(["New", "1", "Hot", "More"]);
  const [query, setQuery] = useState("case");
  const [sort, setSort] = useState("Newest");
  const [message, setMessage] = useState("Selected chip labels are vague and jump around after each click.");
  const [results, setResults] = useState(42);

  const selectChip = (chip: string) => {
    setChips((current) => [chip, ...current.filter((item) => item !== chip)]);
    setResults((count) => Math.max(0, count - 9));
    setMessage(`${chip} moved to the front, so users must rescan the chip row.`);
  };
  const clearBadly = () => {
    setQuery("");
    setSort("A-Z");
    setResults(42);
    setMessage("Clear chip also cleared the query and changed the sort order.");
  };

  return (
    <div className="quality-example filter-chips-demo">
      <div className="filter-chip-controls bad">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>Newest</option>
            <option>A-Z</option>
          </select>
        </label>
      </div>
      <div className="filter-chip-row bad" aria-label="Unstable filter chips">
        {chips.map((chip, index) => (
          <button type="button" className={index === 0 ? "filter-chip-bad-pill is-selected" : "filter-chip-bad-pill"} key={chip} onClick={() => selectChip(chip)}>
            {chip}
          </button>
        ))}
      </div>
      <div className="filter-chip-result-panel bad">
        <div className="filter-chip-summary bad">
          <strong>{results} records</strong>
          <span>Active chip meaning is hidden; query {query || "cleared"}; sort {sort}</span>
        </div>
        <div className="mini-result-list">
          {["Case 104", "Case 221", "Case 318"].map((item) => (
            <button type="button" className="pattern-row" key={item}>{item}</button>
          ))}
        </div>
        <button type="button" className="demo-button small" onClick={clearBadly}>Clear selected chip</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SuggestionsGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "autocomplete") return <AutocompleteGoodUx meta={meta} />;

  const [query, setQuery] = useState("mod");
  const [selected, setSelected] = useState("");
  const suggestions = meta.options.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="quality-example">
      <label>
        <span>{meta.field}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="mini-result-list" role="listbox" aria-label={`${meta.name} options`}>
        {suggestions.map((item) => (
          <button type="button" className="pattern-row" key={item} onClick={() => { setSelected(item); setQuery(item); }}>
            {item}
          </button>
        ))}
      </div>
      <p className="demo-status">Selected: {selected || "none"}</p>
    </div>
  );
}

function AutocompleteGoodUx({ meta }: { meta: PatternMeta }) {
  const [query, setQuery] = useState("Ada");
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const suggestions = meta.options.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  const validSelection = Boolean(selected) && selected === query;
  const invalid = submitted && !validSelection;

  return (
    <div className="quality-example">
      <label>
        <span>{meta.field}</span>
        <input
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-controls="autocomplete-demo-options"
          aria-autocomplete="list"
          aria-invalid={invalid || undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected("");
            setSubmitted(false);
          }}
        />
      </label>
      {suggestions.length > 0 && (
        <div className="mini-result-list" role="listbox" id="autocomplete-demo-options" aria-label={`${meta.field} known values`}>
          {suggestions.slice(0, 3).map((item, index) => (
            <button
              type="button"
              className={index === 0 ? "pattern-row is-selected" : "pattern-row"}
              key={item}
              onClick={() => {
                setSelected(item);
                setQuery(item);
                setSubmitted(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      {invalid && <p className="demo-error compact">Choose a known {meta.field.toLowerCase()} before continuing.</p>}
      <div className="demo-row">
        <button type="button" className="demo-button small primary" onClick={() => setSubmitted(true)}>Continue</button>
        <button type="button" className="demo-button small" onClick={() => { setQuery(""); setSelected(""); setSubmitted(false); }}>Clear</button>
      </div>
      <p className="demo-status" aria-live="polite">
        {validSelection ? `Selected: ${selected}` : `${suggestions.length} matching known values`}
      </p>
    </div>
  );
}

function ComboboxGoodUx({ meta }: { meta: PatternMeta }) {
  const options = [
    { id: "aditi-rao", label: "Aditi Rao", detail: "Design systems" },
    { id: "ada-lovelace", label: "Ada Lovelace", detail: "Analytics" },
    { id: "adam-chen", label: "Adam Chen", detail: "Operations" },
    { id: "grace-hopper", label: "Grace Hopper", detail: "Security" },
    { id: "mina-patel", label: "Mina Patel", detail: "Support" }
  ];
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("A");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null);
  const [customAllowed, setCustomAllowed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("Popup is open; Aditi Rao is the active descendant.");

  const matches = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
  const activeOption = matches[Math.min(activeIndex, Math.max(matches.length - 1, 0))];
  const unresolved = Boolean(query) && !selected && !customAllowed;
  const invalid = submitted && unresolved;

  const acceptOption = (option = activeOption) => {
    if (!option) return;
    setSelected({ id: option.id, label: option.label });
    setQuery(option.label);
    setOpen(false);
    setSubmitted(false);
    setMessage(`Accepted ${option.label}; submitted ID is ${option.id}.`);
  };

  const moveActive = (delta: number) => {
    if (matches.length === 0) return;
    setOpen(true);
    setActiveIndex((current) => {
      const next = (current + delta + matches.length) % matches.length;
      const option = matches[next];
      setMessage(`${option.label} is active, but not committed until accepted.`);
      return next;
    });
  };

  const cancelPopup = () => {
    setOpen(false);
    setMessage(selected ? `Popup closed; ${selected.label} remains selected.` : "Popup closed; no option committed.");
  };

  return (
    <div className="quality-example combobox-demo">
      <label className="combobox-field" htmlFor="combobox-demo-input">
        <span>{meta.field}</span>
        <div className="combobox-input-row">
          <input
            id="combobox-demo-input"
            role="combobox"
            value={query}
            aria-expanded={open}
            aria-controls="combobox-demo-options"
            aria-autocomplete="list"
            aria-activedescendant={open && activeOption ? `combobox-demo-${activeOption.id}` : undefined}
            aria-describedby="combobox-demo-help combobox-demo-status"
            aria-invalid={invalid || undefined}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(null);
              setSubmitted(false);
              setOpen(true);
              setActiveIndex(0);
              setMessage("Typed text changed; selected ID cleared until an option is accepted.");
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                moveActive(1);
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                moveActive(-1);
              }
              if (event.key === "Enter" && open) {
                event.preventDefault();
                acceptOption();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancelPopup();
              }
              if (event.altKey && event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
                setMessage("Popup opened without moving focus out of the field.");
              }
            }}
          />
          <button
            type="button"
            className="combobox-toggle"
            aria-label="Show assignee options"
            aria-expanded={open}
            onClick={() => {
              setOpen((current) => !current);
              setMessage(open ? "Popup collapsed without committing a new option." : "Popup opened; focus stays in the field.");
            }}
          >
            ⌄
          </button>
        </div>
      </label>
      <p id="combobox-demo-help" className="demo-status">Use arrow keys or buttons to move the active option; Enter or Accept commits it.</p>
      {open && (
        <div className="combobox-popup" id="combobox-demo-options" role="listbox" aria-label={`${meta.field} options`}>
          {matches.length > 0 ? matches.map((option, index) => (
            <button
              type="button"
              id={`combobox-demo-${option.id}`}
              className={index === activeIndex ? "combobox-option is-active" : selected?.id === option.id ? "combobox-option is-selected" : "combobox-option"}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => {
                setActiveIndex(index);
                setMessage(`${option.label} is active, but not committed until accepted.`);
              }}
              onClick={() => acceptOption(option)}
              key={option.id}
            >
              <span>{option.label}</span>
              <em>{option.detail}</em>
            </button>
          )) : (
            <div className="combobox-empty" role="status">
              <strong>No matching assignee</strong>
              <span>{customAllowed ? "Custom value can be accepted." : "Choose a listed assignee or allow custom values."}</span>
            </div>
          )}
        </div>
      )}
      <div className="demo-row combobox-actions">
        <button type="button" className="demo-button small primary" onClick={() => acceptOption()}>Accept active option</button>
        <button type="button" className="demo-button small" onClick={() => moveActive(1)}>Move active option</button>
        <button type="button" className="demo-button small" onClick={cancelPopup}>Cancel popup</button>
        <button
          type="button"
          className="demo-button small"
          aria-pressed={customAllowed}
          onClick={() => {
            setCustomAllowed((current) => !current);
            setSubmitted(false);
            setMessage(customAllowed ? "Custom values are now rejected." : "Custom values are now allowed when no option matches.");
          }}
        >
          {customAllowed ? "Custom allowed" : "Allow custom"}
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setQuery("Ada");
            setSelected(null);
            setOpen(true);
            setActiveIndex(0);
            setSubmitted(false);
            setMessage("Visible text changed; previous selected ID was cleared.");
          }}
        >
          Edit after select
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setSubmitted(true);
            setMessage(unresolved ? "Validation stopped unresolved text before stale ID submission." : "Value can be submitted.");
          }}
        >
          Validate
        </button>
      </div>
      {invalid && <p className="demo-error compact">Choose a listed {meta.field.toLowerCase()} or allow a custom value.</p>}
      <div className="combobox-status-card" id="combobox-demo-status" aria-live="polite">
        <strong>{selected ? `Selected: ${selected.label}` : customAllowed && query ? `Custom value: ${query}` : "No submitted ID"}</strong>
        <span>{selected ? `Submitted ID: ${selected.id}` : "Hidden ID is empty while text is unresolved."}</span>
        <em>{message}</em>
      </div>
    </div>
  );
}

function ComboboxBadUx() {
  const [mode, setMode] = useState<"stale" | "focus" | "expanded" | "autocommit">("stale");
  const copy = {
    stale: {
      title: "Stale hidden value",
      detail: "Visible text says Aditi, but the hidden submitted ID is still ada-lovelace."
    },
    focus: {
      title: "Focus leaves the field",
      detail: "Arrow keys jump into option buttons, so typing and cursor editing stop working."
    },
    expanded: {
      title: "Popup state is invisible",
      detail: "The list is open visually while expanded state and popup ownership are missing."
    },
    autocommit: {
      title: "First match auto-committed",
      detail: "Typing Ad immediately selects Adam Chen before the user accepts an option."
    }
  }[mode];

  return (
    <div className="quality-example combobox-demo">
      <div className="combobox-bad-ui">
        <label>
          <span>Assignee</span>
          <input defaultValue={mode === "autocommit" ? "Ad" : "Aditi"} aria-label="Broken assignee combobox" />
        </label>
        <div className="combobox-popup bad" aria-hidden={mode === "expanded" ? "true" : undefined}>
          {["Adam Chen", "Aditi Rao", "Ada Lovelace"].map((item, index) => (
            <button type="button" className={index === 0 ? "combobox-option is-active" : "combobox-option"} key={item}>
              <span>{item}</span>
              <em>{index === 0 && mode === "autocommit" ? "already submitted" : "button focus target"}</em>
            </button>
          ))}
        </div>
        <div className="combobox-hidden-value">hidden assignee_id: {mode === "autocommit" ? "adam-chen" : "ada-lovelace"}</div>
      </div>
      <div className="demo-row combobox-actions">
        <button type="button" className="demo-button small" onClick={() => setMode("stale")}>Stale ID</button>
        <button type="button" className="demo-button small" onClick={() => setMode("focus")}>Focus loss</button>
        <button type="button" className="demo-button small" onClick={() => setMode("expanded")}>No state</button>
        <button type="button" className="demo-button small" onClick={() => setMode("autocommit")}>Auto-commit</button>
      </div>
      <div className="combobox-status-card bad" aria-live="polite">
        <strong>{copy.title}</strong>
        <span>{copy.detail}</span>
      </div>
    </div>
  );
}

function SearchSuggestionsGoodUx({ meta }: { meta: PatternMeta }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const typed = query.trim().toLowerCase();
  const recentSuggestions = ["modal focus trap", "undo destructive action"];
  const querySuggestions = meta.options.filter((item) => item.toLowerCase().includes(typed || "mod"));
  const suggestions = typed ? querySuggestions : recentSuggestions;
  const visibleSuggestions = dismissed ? [] : suggestions.slice(0, 3);

  return (
    <form
      className="quality-example"
      role="search"
      aria-label={`${meta.subject} suggestions`}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmittedQuery(query || visibleSuggestions[0] || "");
        setDismissed(true);
      }}
    >
      <label>
        <span>{meta.field}</span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setDismissed(false);
          }}
          placeholder="Try mod"
        />
      </label>
      {visibleSuggestions.length > 0 && (
        <div className="mini-result-list" role="listbox" aria-label="Suggested searches">
          {visibleSuggestions.map((item, index) => (
            <button
              type="button"
              className={index === 0 ? "pattern-row is-selected" : "pattern-row"}
              key={item}
              onClick={() => {
                setQuery(item);
                setSubmittedQuery("");
              }}
            >
              {typed ? item : `Recent: ${item}`}
            </button>
          ))}
        </div>
      )}
      <div className="demo-row">
        <button type="submit" className="demo-button small primary">Search</button>
        <button type="button" className="demo-button small" onClick={() => setDismissed(true)}>Dismiss</button>
      </div>
      <p className="demo-status" aria-live="polite">
        {submittedQuery ? `Searching for "${submittedQuery}"` : `${visibleSuggestions.length} suggestions`}
      </p>
    </form>
  );
}

function TypeaheadGoodUx() {
  const [query, setQuery] = useState("ca");
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [staleIgnored, setStaleIgnored] = useState(false);
  const [message, setMessage] = useState("Live results update after two characters; selecting a result is explicit.");
  const trimmed = query.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 2;
  const results = getTypeaheadResults(query);

  const updateQuery = (value: string) => {
    setQuery(value);
    setSelected("");
    setStaleIgnored(false);
    if (value.toLowerCase().startsWith("slow")) {
      setLoading(true);
      setMessage(`Searching for "${value}" with a visible loading state.`);
      return;
    }
    setLoading(false);
    setMessage(value.trim().length < 2 ? "Type at least 2 characters before remote lookup starts." : `Showing current results for "${value}".`);
  };

  return (
    <form
      className="quality-example typeahead-demo"
      role="search"
      aria-label="Search as you type demo"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(false);
        setSelected("");
        setMessage(`Submitted full search for "${trimmed || "empty query"}".`);
      }}
    >
      <label>
        <span>Search cases</span>
        <input
          aria-controls="typeahead-results"
          aria-expanded={results.length > 0 && !loading}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Type ca, case, claim, or slow"
        />
      </label>
      <div className="typeahead-status-row" aria-live="polite">
        <span>
          {loading
            ? `Loading current results for "${query}"`
            : tooShort
              ? "Waiting for 2 characters"
              : `${results.length} live ${results.length === 1 ? "result" : "results"} for "${trimmed || "empty"}"`}
        </span>
        <em>{staleIgnored ? "Stale ca response ignored" : "Debounced - current query only"}</em>
      </div>
      {!loading && !tooShort && results.length > 0 && (
        <div className="typeahead-result-list" role="listbox" id="typeahead-results" aria-label="Live typeahead results">
          {results.map((item, index) => (
            <button
              type="button"
              className={selected === item.id || (!selected && index === 0) ? "typeahead-result is-active" : "typeahead-result"}
              key={item.id}
              onClick={() => {
                setSelected(item.id);
                setMessage(`Selected result "${item.title}" without replacing the typed query.`);
              }}
            >
              <span>{item.title}</span>
              <em>{item.type} - {item.detail}</em>
            </button>
          ))}
        </div>
      )}
      {loading && (
        <div className="typeahead-empty" role="status">
          <strong>Searching...</strong>
          <span>Older responses cannot replace this pending query.</span>
        </div>
      )}
      {!loading && (tooShort || results.length === 0) && (
        <div className="typeahead-empty" role="status">
          <strong>{tooShort ? "Lookup not started" : "No live results"}</strong>
          <span>{tooShort ? "The service waits until the query has enough signal." : "Full search remains available for broader matching."}</span>
        </div>
      )}
      <div className="demo-row typeahead-actions">
        <button type="submit" className="demo-button small primary">Full search</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setQuery("case");
            setLoading(false);
            setSelected("");
            setStaleIgnored(true);
            setMessage("Ignored stale ca results because the current query is case.");
          }}
        >
          Simulate slow ca response
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setQuery("");
            setSelected("");
            setLoading(false);
            setStaleIgnored(false);
            setMessage("Typeahead cleared; no remote lookup is active.");
          }}
        >
          Clear
        </button>
      </div>
      <p className="demo-status" aria-live="polite">
        {selected ? `Selected: ${typeaheadResults.find((item) => item.id === selected)?.title}` : message}
      </p>
    </form>
  );
}

type RecentSearchQuery = {
  id: string;
  query: string;
  scope: string;
  time: string;
  count: number;
};

type SearchHistorySource = "all" | "drive" | "gmail" | "web" | "youtube";

type SearchHistoryEvent = {
  id: string;
  query: string;
  source: Exclude<SearchHistorySource, "all">;
  sourceLabel: string;
  date: string;
  device: string;
  scope: string;
};

type TypeaheadResult = {
  id: string;
  title: string;
  type: string;
  detail: string;
  keywords: string[];
};

const seedRecentSearches: RecentSearchQuery[] = [
  { id: "appeal", query: "benefit appeal deadline", scope: "Benefits workspace", time: "4 min ago", count: 18 },
  { id: "housing", query: "housing evidence upload", scope: "Current service", time: "Yesterday", count: 6 },
  { id: "debt", query: "debt advice appointment", scope: "All knowledge", time: "Last week", count: 11 }
];

const seedSearchHistory: SearchHistoryEvent[] = [
  { id: "drive-appeal", query: "benefit appeal", source: "drive", sourceLabel: "Drive", date: "Today", device: "MacBook", scope: "Workspace account" },
  { id: "gmail-housing", query: "housing evidence", source: "gmail", sourceLabel: "Gmail", date: "Yesterday", device: "iPhone", scope: "Workspace account" },
  { id: "web-debt", query: "debt advice", source: "web", sourceLabel: "Web Search", date: "Jun 6", device: "Chrome", scope: "Google account" },
  { id: "youtube-hearing", query: "appeal hearing", source: "youtube", sourceLabel: "YouTube", date: "Jun 4", device: "Tablet", scope: "Personal account" }
];

const typeaheadResults: TypeaheadResult[] = [
  { id: "case-104", title: "Case 104 - Benefit appeal", type: "Case record", detail: "Updated today - Benefits workspace", keywords: ["case", "cas", "benefit", "appeal"] },
  { id: "case-221", title: "Case 221 - Housing evidence", type: "Case record", detail: "Needs documents - Housing", keywords: ["case", "cas", "housing", "evidence"] },
  { id: "case-checklist", title: "Case review checklist", type: "Knowledge article", detail: "8 matching passages", keywords: ["case", "cas", "checklist", "review"] },
  { id: "calendar-hearing", title: "Calendar hearing guide", type: "Knowledge article", detail: "Appeal calendar workflow", keywords: ["cal", "calendar", "hearing", "appeal"] },
  { id: "claim-renewal", title: "Claim renewal notice", type: "Template", detail: "Reusable letter template", keywords: ["claim", "renewal", "notice"] }
];

function getTypeaheadResults(query: string) {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];
  return typeaheadResults.filter((item) => {
    const haystack = `${item.title} ${item.type} ${item.detail}`.toLowerCase();
    return haystack.includes(normalized) || item.keywords.some((keyword) => keyword.includes(normalized) || normalized.includes(keyword));
  });
}

function RecentlySearchedGoodUx() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<RecentSearchQuery[]>(seedRecentSearches);
  const [activeId, setActiveId] = useState(seedRecentSearches[0].id);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [message, setMessage] = useState("Recently searched stores submitted queries for this signed-in account.");
  const activeItem = items.find((item) => item.id === activeId);

  const submitQuery = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setMessage("Type a query before it can be added to recent searches.");
      return;
    }
    if (!historyEnabled) {
      setMessage(`Search ran for "${trimmed}", but history is off so the query was not stored.`);
      return;
    }
    const nextItem: RecentSearchQuery = {
      id: `query-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      query: trimmed,
      scope: "Benefits workspace",
      time: "Just now",
      count: Math.max(3, Math.min(42, trimmed.length + 5))
    };
    setItems((current) => [nextItem, ...current.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5));
    setActiveId(nextItem.id);
    setMessage(`"${trimmed}" added to the top of recent searches without creating a saved search.`);
  };

  const rerunSearch = (item: RecentSearchQuery) => {
    setQuery(item.query);
    setActiveId(item.id);
    setMessage(`Reran "${item.query}" in ${item.scope}; current result count is ${item.count}.`);
  };

  const removeSearch = (item: RecentSearchQuery) => {
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setMessage(`Removed "${item.query}" from recent search history only.`);
    if (activeId === item.id) {
      const nextItem = items.find((entry) => entry.id !== item.id);
      if (nextItem) setActiveId(nextItem.id);
    }
  };

  return (
    <form className="quality-example recent-searches-demo" role="search" aria-label="Recently searched demo" onSubmit={submitQuery}>
      <div className="recent-search-entry">
        <label>
          <span>Search query</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try renewal notice" />
        </label>
        <button type="submit" className="demo-button small primary">Search</button>
      </div>
      <div className="recent-search-controls">
        <label className="recent-search-history-toggle">
          <input
            type="checkbox"
            checked={historyEnabled}
            onChange={(event) => {
              setHistoryEnabled(event.target.checked);
              setMessage(event.target.checked ? "Search history is on for this demo account." : "Search history is off; new searches will not be stored.");
            }}
          />
          <span>Save recent searches</span>
        </label>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setItems([]);
            setMessage("Recent search history cleared. Saved searches and viewed records are unchanged.");
          }}
        >
          Clear history
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setItems(seedRecentSearches);
            setActiveId(seedRecentSearches[0].id);
            setMessage("Sample recent searches restored.");
          }}
        >
          Restore sample
        </button>
      </div>
      {items.length > 0 ? (
        <section className="recent-search-list" aria-label="Recent searches">
          <div className="recent-search-header">
            <strong>Recently searched</strong>
            <small>This account - newest first - limit 5</small>
          </div>
          {items.map((item) => (
            <div className={item.id === activeId ? "recent-search-row is-active" : "recent-search-row"} key={item.id}>
              <button type="button" onClick={() => rerunSearch(item)}>
                <span>{item.query}</span>
                <em>{item.scope} - {item.time} - {item.count} current results</em>
              </button>
              <button type="button" className="remove-recent-button" onClick={() => removeSearch(item)} aria-label={`Remove ${item.query} from recent searches`}>Remove</button>
            </div>
          ))}
        </section>
      ) : (
        <section className="recent-search-empty" role="status">
          <strong>No recent searches</strong>
          <span>The section is hidden or replaced with an empty state until a query is submitted with history on.</span>
        </section>
      )}
      {activeItem && (
        <div className="recent-search-preview" aria-live="polite">
          <strong>{activeItem.query}</strong>
          <span>Reruns the query text and scope; it is not a saved search, recommendation, or viewed item.</span>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{message}</p>
    </form>
  );
}

function SearchHistoryGoodUx() {
  const [items, setItems] = useState<SearchHistoryEvent[]>(seedSearchHistory);
  const [source, setSource] = useState<SearchHistorySource>("all");
  const [historyOn, setHistoryOn] = useState(true);
  const [savedSearches] = useState(["Renewal risk", "My blocked reviews"]);
  const [message, setMessage] = useState("Search history is on for this account; saved searches are separate.");
  const visibleItems = source === "all" ? items : items.filter((item) => item.source === source);

  const removeEntry = (entry: SearchHistoryEvent) => {
    setItems((current) => current.filter((item) => item.id !== entry.id));
    setMessage(`Deleted "${entry.query}" from search history only. Saved searches remain unchanged.`);
  };

  const deleteVisibleRange = () => {
    const visibleIds = new Set(visibleItems.map((item) => item.id));
    setItems((current) => current.filter((item) => !visibleIds.has(item.id)));
    setMessage(`Deleted ${visibleItems.length} visible search history ${visibleItems.length === 1 ? "entry" : "entries"} for the selected source and range.`);
  };

  const restoreSample = () => {
    setItems(seedSearchHistory);
    setSource("all");
    setHistoryOn(true);
    setMessage("Sample search history restored; future capture is on.");
  };

  return (
    <div className="quality-example search-history-demo">
      <div className="search-history-summary">
        <div>
          <span>Search history</span>
          <strong>{historyOn ? "On for art@example.com" : "Paused for future searches"}</strong>
        </div>
        <label className="search-history-toggle">
          <input
            type="checkbox"
            checked={historyOn}
            onChange={(event) => {
              setHistoryOn(event.target.checked);
              setMessage(event.target.checked
                ? "Future searches will be saved again. Deleted entries are not restored."
                : "Future searches will not be saved. Existing history remains until deleted.");
            }}
          />
          <span>Save future searches</span>
        </label>
      </div>
      <div className="search-history-controls">
        <label>
          <span>Source</span>
          <select
            value={source}
            onChange={(event) => {
              setSource(event.target.value as SearchHistorySource);
              setMessage(`Filtered search history to ${event.target.value === "all" ? "all sources" : event.target.value}. No entries were deleted.`);
            }}
          >
            <option value="all">All products</option>
            <option value="drive">Drive</option>
            <option value="gmail">Gmail</option>
            <option value="web">Web Search</option>
            <option value="youtube">YouTube</option>
          </select>
        </label>
        <div className="search-history-range">
          <span>Date range</span>
          <strong>Last 7 days</strong>
        </div>
        <button type="button" className="demo-button small danger" onClick={deleteVisibleRange} disabled={visibleItems.length === 0}>Delete visible range</button>
        <button type="button" className="demo-button small" onClick={restoreSample}>Restore sample</button>
      </div>
      {visibleItems.length > 0 ? (
        <section className="search-history-list" aria-label="Stored search activity">
          {visibleItems.map((entry) => (
            <div className="search-history-row" key={entry.id}>
              <span>{entry.query}</span>
              <em>{entry.sourceLabel} - {entry.date} - {entry.device} - {entry.scope}</em>
              <button type="button" className="remove-recent-button" onClick={() => removeEntry(entry)} aria-label={`Delete ${entry.query} from search history`}>
                Delete
              </button>
            </div>
          ))}
        </section>
      ) : (
        <section className="search-history-empty" role="status">
          <strong>No search history for this filter</strong>
          <span>Saved searches and recently viewed items are still available elsewhere.</span>
        </section>
      )}
      <div className="search-history-saved-boundary">
        <strong>Saved searches unaffected</strong>
        <span>{savedSearches.join(", ")}</span>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CommandGoodUx({ meta }: { meta: PatternMeta }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("open");
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("Ready");
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const commandDetails = meta.options.map((name) => ({
    name,
    scope: name.includes("workspace") ? "Workspace admin" : name.includes("billing") ? "Billing" : name.includes("audit") ? "Security" : "Global",
    type: name.startsWith("Open") || name.startsWith("Go") ? "Navigate" : name.startsWith("Delete") ? "Confirm" : "Run",
    requiresConfirmation: name.startsWith("Delete")
  }));
  const normalizedQuery = query.trim().toLowerCase();
  const commands = commandDetails.filter((item) => {
    const haystack = `${item.name} ${item.scope} ${item.type}`.toLowerCase();
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });
  const activeCommand = commands[Math.min(activeIndex, Math.max(commands.length - 1, 0))];

  const closePalette = (message = "Dismissed") => {
    setOpen(false);
    setStatus(message);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  const runCommand = (command = activeCommand) => {
    if (!command) {
      setStatus(`No command matches "${query}"`);
      return;
    }
    if (command.requiresConfirmation) {
      setStatus(`Confirmation required: ${command.name}`);
      return;
    }
    setOpen(false);
    setStatus(`${command.type}: ${command.name}`);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (activeIndex > commands.length - 1) setActiveIndex(Math.max(commands.length - 1, 0));
  }, [activeIndex, commands.length]);

  return (
    <div className="quality-example">
      <button
        type="button"
        className="demo-button small primary"
        ref={openerRef}
        onClick={() => {
          setOpen(true);
          setStatus("Palette open");
        }}
      >
        Open palette
      </button>
      <kbd className="shortcut-hint">Ctrl K</kbd>
      {open && (
        <div
          className="demo-mini-panel corrected compact-command"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closePalette();
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, Math.max(commands.length - 1, 0)));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              runCommand();
            }
          }}
        >
          <div className="command-preview-bar">
            <strong>Command palette</strong>
            <span className="command-scope">Workspace admin</span>
          </div>
          <label>
            <span>{meta.field}</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              aria-controls="command-demo-results"
              aria-activedescendant={activeCommand ? `command-demo-${activeCommand.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}` : undefined}
              placeholder="Filter commands"
            />
          </label>
          {commands.length > 0 ? (
            <div className="mini-result-list" role="listbox" id="command-demo-results" aria-label="Available commands">
              {commands.map((item, index) => {
                const selected = index === activeIndex;
                const id = `command-demo-${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
                return (
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    id={id}
                    className={selected ? "pattern-row is-selected command-row" : "pattern-row command-row"}
                    key={item.name}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runCommand(item)}
                  >
                    <span>{item.name}</span>
                    <small>{item.type} - {item.scope}{item.requiresConfirmation ? " - needs confirmation" : ""}</small>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="demo-empty compact-empty" role="status">
              <h3>No matching commands</h3>
              <button type="button" className="demo-button small" onClick={() => setQuery("")}>Clear query</button>
            </div>
          )}
          <div className="demo-row">
            <button type="button" className="demo-button small primary" onClick={() => runCommand()}>Run active</button>
            <button type="button" className="demo-button small" onClick={() => closePalette()}>Close</button>
          </div>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function FacetedGoodUx() {
  const records = [
    { name: "Modal dialog", platform: "web", maturity: "standard" },
    { name: "Bottom navigation", platform: "mobile", maturity: "established" },
    { name: "Prompt suggestions", platform: "web", maturity: "emerging" },
    { name: "Offline mobile retry", platform: "mobile", maturity: "emerging" }
  ];
  const [webOnly, setWebOnly] = useState(false);
  const [standardOnly, setStandardOnly] = useState(false);
  const [mobileOnly, setMobileOnly] = useState(false);
  const visible = records.filter((item) => (!webOnly || item.platform === "web") && (!standardOnly || item.maturity === "standard"));
  const filtered = visible.filter((item) => !mobileOnly || item.platform === "mobile");
  const activeFacets = [
    webOnly ? { label: "Platform: web", clear: () => setWebOnly(false) } : null,
    mobileOnly ? { label: "Platform: mobile", clear: () => setMobileOnly(false) } : null,
    standardOnly ? { label: "Maturity: standard", clear: () => setStandardOnly(false) } : null
  ].filter((item): item is { label: string; clear: () => void } => Boolean(item));
  const clearAll = () => {
    setWebOnly(false);
    setMobileOnly(false);
    setStandardOnly(false);
  };

  return (
    <div className="quality-example">
      <fieldset className="quality-fieldset">
        <legend>Filters</legend>
        <label className="checkbox-label">
          <input type="checkbox" checked={webOnly} onChange={(event) => setWebOnly(event.target.checked)} />
          web
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={mobileOnly} onChange={(event) => setMobileOnly(event.target.checked)} />
          mobile
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={standardOnly} onChange={(event) => setStandardOnly(event.target.checked)} />
          standard
        </label>
      </fieldset>
      {activeFacets.length > 0 && (
        <div className="demo-row" aria-label="Applied filters">
          {activeFacets.map((facet) => (
            <button type="button" className="demo-button small" key={facet.label} onClick={facet.clear}>
              {facet.label} x
            </button>
          ))}
        </div>
      )}
      <p className="demo-status" aria-live="polite">{filtered.length} results</p>
      {filtered.length > 0 ? (
        <div className="mini-result-list">
          {filtered.map((item) => <button type="button" className="pattern-row" key={item.name}>{item.name}</button>)}
        </div>
      ) : (
        <div className="demo-empty compact-empty" role="status">
          <h3>No matching facets</h3>
          <button type="button" className="demo-button small" onClick={clearAll}>Clear all filters</button>
        </div>
      )}
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <SearchUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <SearchUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <SearchGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <SearchBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
