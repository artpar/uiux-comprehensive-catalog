import { useState } from "react";

const destinations = [
  { id: "home", label: "Home", content: "Overview, recent activity, and primary status." },
  { id: "search", label: "Search", content: "Find patterns and narrow by task." },
  { id: "saved", label: "Saved", content: "Pinned patterns and decision notes." },
  { id: "settings", label: "Settings", content: "Preferences and account controls." }
];

export default function BottomNavigationDemo() {
  const [active, setActive] = useState(destinations[0]);

  return (
    <div className="phone-frame">
      <div className="phone-content">
        <h3>{active.label}</h3>
        <p>{active.content}</p>
      </div>
      <nav className="bottom-nav-demo" aria-label="Demo bottom navigation">
        {destinations.map((destination) => (
          <button
            key={destination.id}
            className={destination.id === active.id ? "is-active" : ""}
            aria-current={destination.id === active.id ? "page" : undefined}
            onClick={() => setActive(destination)}
          >
            <span aria-hidden="true">{destination.label.slice(0, 1)}</span>
            {destination.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
