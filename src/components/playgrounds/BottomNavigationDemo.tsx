import { useState } from "react";

const destinations = [
  { id: "home", label: "Home", content: "Overview, recent activity, and primary status." },
  { id: "search", label: "Search", content: "Find patterns and narrow by task." },
  { id: "saved", label: "Saved", content: "Pinned patterns and decision notes.", badge: "2" },
  { id: "alerts", label: "Alerts", content: "Unread operational notices.", badge: "5" },
  { id: "settings", label: "Settings", content: "Preferences and account controls." },
  { id: "billing", label: "Billing", content: "Account billing and plan controls." }
];

export default function BottomNavigationDemo() {
  const [active, setActive] = useState(destinations[0]);
  const [showOverflow, setShowOverflow] = useState(false);
  const visibleDestinations = showOverflow ? destinations.slice(0, 4) : destinations.slice(0, 5);

  return (
    <div className="demo-surface">
      <div className="demo-row" role="group" aria-label="Bottom navigation constraints">
        <button
          type="button"
          className={!showOverflow ? "demo-button small primary" : "demo-button small"}
          aria-pressed={!showOverflow}
          onClick={() => {
            setShowOverflow(false);
            setActive(destinations[0]);
          }}
        >
          Five destinations
        </button>
        <button
          type="button"
          className={showOverflow ? "demo-button small primary" : "demo-button small"}
          aria-pressed={showOverflow}
          onClick={() => {
            setShowOverflow(true);
            setActive(destinations[0]);
          }}
        >
          Overflow example
        </button>
      </div>
      <div className="phone-frame">
        <div className="phone-content">
          <h3>{active.label}</h3>
          <p>{active.content}</p>
          {showOverflow && <p className="demo-status">More than five top-level destinations need an overflow or different navigation pattern.</p>}
        </div>
        <nav
          className="bottom-nav-demo"
          aria-label="Demo bottom navigation"
          style={{ gridTemplateColumns: `repeat(${visibleDestinations.length + (showOverflow ? 1 : 0)}, minmax(0, 1fr))` }}
        >
          {visibleDestinations.map((destination) => (
            <button
              key={destination.id}
              className={destination.id === active.id ? "is-active" : ""}
              aria-current={destination.id === active.id ? "page" : undefined}
              onClick={() => setActive(destination)}
            >
              <span className={`nav-symbol nav-symbol-${destination.id}`} aria-hidden="true"></span>
              <em>{destination.label}</em>
              {destination.badge && <strong aria-label={`${destination.badge} updates`}>{destination.badge}</strong>}
            </button>
          ))}
          {showOverflow && (
            <button
              type="button"
              className={active.id === "billing" ? "is-active" : ""}
              aria-current={active.id === "billing" ? "page" : undefined}
              onClick={() => setActive(destinations[5])}
            >
              <span className="nav-symbol nav-symbol-more" aria-hidden="true"></span>
              <em>More</em>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
