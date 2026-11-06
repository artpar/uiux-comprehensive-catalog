import { useState, type CSSProperties } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type MapPlace = {
  id: string;
  name: string;
  kind: "Clinic" | "Pharmacy" | "Urgent";
  status: "Open" | "Busy" | "Closed";
  distance: string;
  x: number;
  y: number;
  route: string;
  layer: "care" | "transit";
};

const mapPlaces: MapPlace[] = [
  { id: "MV-12", name: "Riverside Clinic", kind: "Clinic", status: "Open", distance: "0.8 mi", x: 30, y: 42, route: "9 min by bike", layer: "care" },
  { id: "MV-18", name: "Market Street Pharmacy", kind: "Pharmacy", status: "Open", distance: "1.1 mi", x: 48, y: 35, route: "14 min walk", layer: "care" },
  { id: "MV-24", name: "Central Urgent Care", kind: "Urgent", status: "Busy", distance: "1.7 mi", x: 63, y: 55, route: "11 min drive", layer: "care" },
  { id: "MV-31", name: "North Station Clinic", kind: "Clinic", status: "Open", distance: "2.4 mi", x: 72, y: 25, route: "18 min transit", layer: "transit" },
  { id: "MV-44", name: "Harbor Walk-in", kind: "Urgent", status: "Closed", distance: "3.0 mi", x: 22, y: 66, route: "22 min drive", layer: "care" }
];

function MapPin({
  place,
  selected,
  onSelect
}: {
  place: MapPlace;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`map-pin is-${place.kind.toLowerCase()}${selected ? " is-selected" : ""}`}
      style={{ "--pin-x": `${place.x}%`, "--pin-y": `${place.y}%` } as CSSProperties}
      aria-label={`${place.name}, ${place.kind}, ${place.status}, ${place.distance}`}
      onClick={() => onSelect(place.id)}
    >
      <span>{place.kind === "Urgent" ? "!" : place.kind === "Pharmacy" ? "Rx" : "+"}</span>
    </button>
  );
}

function MapViewSurface({
  places,
  selectedId,
  layers,
  clusterOpen = false,
  routeOpen = false,
  onSelect
}: {
  places: MapPlace[];
  selectedId: string;
  layers: Set<MapPlace["layer"]>;
  clusterOpen?: boolean;
  routeOpen?: boolean;
  onSelect: (id: string) => void;
}) {
  const selectedPlace = places.find((place) => place.id === selectedId) ?? places[0];
  const visiblePlaces = places.filter((place) => layers.has(place.layer));
  const clusterPlaces = visiblePlaces.filter((place) => place.x > 58 && place.y < 60);

  return (
    <div className="map-view-shell">
      <div className="map-view-frame" aria-label="Clinic finder map, Downtown west bounds, zoom 12">
        <div className="map-grid" aria-hidden="true" />
        <div className="map-route" hidden={!routeOpen} aria-hidden="true" />
        <div className="map-radius" aria-hidden="true">2 mi</div>
        {visiblePlaces.map((place) => (
          <MapPin place={place} selected={place.id === selectedId} onSelect={onSelect} key={place.id} />
        ))}
        <button type="button" className={`map-cluster${clusterOpen ? " is-open" : ""}`} onClick={() => onSelect("MV-24")} aria-label={`${clusterPlaces.length} clinics clustered near central station`}>
          {clusterOpen ? "3 open" : clusterPlaces.length}
        </button>
        <aside className="map-popup" aria-label={`Selected place ${selectedPlace.name}`}>
          <strong>{selectedPlace.name}</strong>
          <span>{selectedPlace.kind} - {selectedPlace.status}</span>
          <span>{selectedPlace.distance} from saved address</span>
          <span>{selectedPlace.route}</span>
        </aside>
        <div className="map-attribution">Tiles, bounds, and result list stay synchronized</div>
      </div>
      <ol className="map-result-list" aria-label="Map results fallback list">
        {visiblePlaces.slice(0, 4).map((place) => (
          <li className={place.id === selectedId ? "is-selected" : ""} key={place.id}>
            <button type="button" onClick={() => onSelect(place.id)}>
              <strong>{place.name}</strong>
              <span>{place.status} - {place.distance} - {place.route}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MapViewGoodUi() {
  const selectedId = "MV-12";
  return (
    <div className="quality-example map-view-demo">
      <div className="map-toolbar" id="map-view-ui-label">
        <strong>Downtown west</strong>
        <span>Zoom 12</span>
        <span>5 places</span>
        <span>Clusters on</span>
        <span>Care + transit layers</span>
      </div>
      <MapViewSurface places={mapPlaces} selectedId={selectedId} layers={new Set(["care", "transit"])} onSelect={() => undefined} />
      <p className="demo-status">The map exposes viewport, markers, cluster count, selected-place popup, radius, layer state, and synchronized fallback results.</p>
    </div>
  );
}

function MapViewBadUi() {
  return (
    <div className="bad-ui-sample map-view-bad-demo is-decorativePins">
      <div className="map-broken" aria-label="Broken decorative map">
        <span className="dot a" />
        <span className="dot b" />
        <span className="dot c" />
        <span className="dot d" />
        <strong>Nice places nearby</strong>
      </div>
      <p className="demo-status">The broken map uses decorative pins with no bounds, marker labels, selected state, legend, cluster count, distance, or fallback list.</p>
    </div>
  );
}

function MapViewGoodUx() {
  const [selectedId, setSelectedId] = useState("MV-12");
  const [layers, setLayers] = useState<Set<MapPlace["layer"]>>(() => new Set(["care", "transit"]));
  const [clusterOpen, setClusterOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState(false);
  const [listMode, setListMode] = useState(false);
  const [message, setMessage] = useState("Downtown west bounds show 5 places, selected marker MV-12, active layers, and a synchronized fallback list.");

  const selectedPlace = mapPlaces.find((place) => place.id === selectedId) ?? mapPlaces[0];

  function selectPlace(id: string) {
    const place = mapPlaces.find((item) => item.id === id);
    setSelectedId(id);
    if (place) setMessage(`${place.name} selected. Popup, fallback list, status, distance, and route context now match.`);
  }

  function toggleTransitLayer() {
    setLayers((current) => {
      const next = new Set(current);
      if (next.has("transit")) {
        next.delete("transit");
        setMessage("Transit layer hidden; marker count and fallback list update from the same visible result set.");
      } else {
        next.add("transit");
        setMessage("Transit layer restored with station-adjacent clinics visible again.");
      }
      return next;
    });
  }

  return (
    <div className={`quality-example map-view-demo${listMode ? " is-list-mode" : ""}`}>
      <div className="map-toolbar">
        <strong>{manualLocation ? "Manual address" : "Downtown west"}</strong>
        <span>{clusterOpen ? "Cluster expanded" : "Clustered markers"}</span>
        <span>{layers.size} layers active</span>
        <span>{selectedPlace.distance}</span>
      </div>
      <MapViewSurface places={mapPlaces} selectedId={selectedId} layers={layers} clusterOpen={clusterOpen} routeOpen={routeOpen} onSelect={selectPlace} />
      <div className="demo-row map-controls" aria-label="Map view exercise controls">
        <button type="button" className="demo-button small" onClick={() => {
          setMessage("Map panned east. Bounds summary and fallback list would refresh before users trust visible markers.");
        }}>Pan east</button>
        <button type="button" className={clusterOpen ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setClusterOpen((value) => !value);
          setMessage(!clusterOpen ? "Zoom expanded the central cluster and kept contained places inspectable." : "Cluster collapsed back to a count marker.");
        }}>Zoom cluster</button>
        <button type="button" className="demo-button small" onClick={() => selectPlace("MV-24")}>Select urgent care</button>
        <button type="button" className={layers.has("transit") ? "demo-button small primary" : "demo-button small"} onClick={toggleTransitLayer}>Transit layer</button>
        <button type="button" className="demo-button small" onClick={() => {
          setManualLocation(true);
          setMessage("Location permission denied; manual address fallback keeps nearby results usable.");
        }}>Deny location</button>
        <button type="button" className={routeOpen ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRouteOpen((value) => !value);
          setMessage(!routeOpen ? `${selectedPlace.name} route preview opened with origin, travel mode, and distance context.` : "Route preview closed while selected marker remains stable.");
        }}>Route preview</button>
        <button type="button" className={listMode ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setListMode((value) => !value);
          setMessage(!listMode ? "Fallback list emphasized for keyboard review while map selection stays synchronized." : "Map-first layout restored with the same selected place.");
        }}>List fallback</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function MapViewBadUx() {
  type Mode = "decorativePins" | "noCluster" | "noLegend" | "permissionDeadEnd" | "staleBounds" | "hoverOnly" | "wrongDistance";
  const [mode, setMode] = useState<Mode>("decorativePins");
  const copy: Record<Mode, string> = {
    decorativePins: "Pins are decorative, so their position does not support a spatial decision.",
    noCluster: "Dense markers overlap and hide the actual number of nearby places.",
    noLegend: "Marker colors and route lines have no text legend or status meaning.",
    permissionDeadEnd: "Location permission denial blocks the workflow instead of offering manual search.",
    staleBounds: "The map moved but result count and fallback list still describe the old area.",
    hoverOnly: "Place details only appear on hover, leaving keyboard users without marker detail.",
    wrongDistance: "Distance appears without origin, unit, travel mode, or freshness, so users pick the wrong place."
  };

  return (
    <div className={`quality-example map-view-bad-demo is-${mode}`}>
      <div className="map-broken" aria-label="Broken map behavior">
        <span className="dot a" />
        <span className="dot b" />
        <span className="dot c" />
        <span className="dot d" />
        <strong>{mode === "permissionDeadEnd" ? "Enable location to continue" : mode === "staleBounds" ? "12 results, old area" : "Nearby"}</strong>
        <em>{mode === "wrongDistance" ? "2 away" : mode === "noLegend" ? "Green means ?" : mode === "hoverOnly" ? "Hover pins" : "No details"}</em>
      </div>
      <div className="demo-row map-controls">
        <button type="button" className={mode === "decorativePins" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("decorativePins")}>Decorative pins</button>
        <button type="button" className={mode === "noCluster" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noCluster")}>No cluster</button>
        <button type="button" className={mode === "noLegend" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noLegend")}>No legend</button>
        <button type="button" className={mode === "permissionDeadEnd" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("permissionDeadEnd")}>Permission dead end</button>
        <button type="button" className={mode === "staleBounds" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleBounds")}>Stale bounds</button>
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "wrongDistance" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongDistance")}>Wrong distance</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MapViewGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MapViewBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MapViewGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MapViewBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
