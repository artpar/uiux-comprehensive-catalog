import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type LocationPermissionMode =
  | "unsupported"
  | "prePrompt"
  | "promptReady"
  | "allowOnce"
  | "whileUsing"
  | "approximate"
  | "precise"
  | "grantedFix"
  | "denied"
  | "settingsRecovery"
  | "timeout"
  | "staleLocation"
  | "manualFallback"
  | "savedPlace"
  | "activeTracking"
  | "stopSharing"
  | "retention"
  | "offline";

type LocationPermissionBadMode =
  | "coldStart"
  | "forcedPrecise"
  | "noFallback"
  | "staleCoordinate"
  | "backgroundSurprise"
  | "settingsDeadEnd"
  | "retainedLocation";

const locationPermissionGoodLabels: Array<[LocationPermissionMode, string]> = [
  ["unsupported", "Unsupported"],
  ["prePrompt", "Pre-prompt"],
  ["promptReady", "Prompt ready"],
  ["allowOnce", "Allow once"],
  ["whileUsing", "While using"],
  ["approximate", "Approximate"],
  ["precise", "Precise"],
  ["grantedFix", "Granted fix"],
  ["denied", "Denied"],
  ["settingsRecovery", "Settings recovery"],
  ["timeout", "Timeout"],
  ["staleLocation", "Stale location"],
  ["manualFallback", "Manual fallback"],
  ["savedPlace", "Saved place"],
  ["activeTracking", "Active tracking"],
  ["stopSharing", "Stop sharing"],
  ["retention", "Retention"],
  ["offline", "Offline"]
];

const locationPermissionBadLabels: Array<[LocationPermissionBadMode, string]> = [
  ["coldStart", "Cold start"],
  ["forcedPrecise", "Forced precise"],
  ["noFallback", "No fallback"],
  ["staleCoordinate", "Stale coordinate"],
  ["backgroundSurprise", "Background surprise"],
  ["settingsDeadEnd", "Settings dead end"],
  ["retainedLocation", "Retained location"]
];

function LocationPermissionPanel({ mode = "prePrompt", idSuffix = "static" }: { mode?: LocationPermissionMode; idSuffix?: string }) {
  const config: Record<LocationPermissionMode, {
    chip: string;
    title: string;
    purpose: string;
    scope: string;
    precision: string;
    status: string;
    age: string;
    fallback: string;
    privacy: string;
    next: string;
    tone?: "safe" | "warn" | "neutral";
    tracking?: boolean;
  }> = {
    unsupported: {
      chip: "Unsupported",
      title: "Use current location is unavailable",
      purpose: "Check in at the nearest gate",
      scope: "No browser prompt",
      precision: "Manual place required",
      status: "Location needs HTTPS, browser support, and app permission policy.",
      age: "No coordinate",
      fallback: "Enter gate or address",
      privacy: "No location collected",
      next: "Continue manually",
      tone: "neutral"
    },
    prePrompt: {
      chip: "Pre-prompt",
      title: "Explain location before the native prompt",
      purpose: "Confirm you are near Gate B before check-in",
      scope: "One-time request",
      precision: "Approximate is accepted",
      status: "Users choose Use current location after seeing purpose, scope, precision, and fallback.",
      age: "Not requested",
      fallback: "Enter gate manually",
      privacy: "Discard after check-in",
      next: "Use current location",
      tone: "safe"
    },
    promptReady: {
      chip: "Prompt ready",
      title: "Native prompt follows user intent",
      purpose: "Find the nearest route entrance",
      scope: "Browser prompt pending",
      precision: "City block accuracy is enough",
      status: "The prompt is triggered by the visible action, not page load.",
      age: "Request starting",
      fallback: "Use saved home",
      privacy: "Only this route search",
      next: "Allow or enter address",
      tone: "safe"
    },
    allowOnce: {
      chip: "Allow once",
      title: "One-time location completes the task",
      purpose: "Start a single route estimate",
      scope: "One current fix",
      precision: "Approximate accepted",
      status: "The flow does not keep watching after the route estimate is shown.",
      age: "Fresh fix",
      fallback: "Change start point",
      privacy: "Coordinate discarded",
      next: "Confirm start",
      tone: "safe"
    },
    whileUsing: {
      chip: "While using",
      title: "Session-scoped access stays visible",
      purpose: "Update arrival time while this route is open",
      scope: "While using this tab",
      precision: "Street-level preferred",
      status: "The session scope is visible and has a clear end condition.",
      age: "Updated now",
      fallback: "Pause updates",
      privacy: "Stops when route closes",
      next: "Track route",
      tone: "safe",
      tracking: true
    },
    approximate: {
      chip: "Approximate",
      title: "Approximate location still works",
      purpose: "Sort nearby stations",
      scope: "One-time request",
      precision: "Approximate only",
      status: "The task accepts city-level or neighborhood-level accuracy without forcing exact coordinates.",
      age: "Updated 1 min ago",
      fallback: "Search by ZIP",
      privacy: "No exact route stored",
      next: "Show nearby stations",
      tone: "safe"
    },
    precise: {
      chip: "Precise",
      title: "Precise location has a specific reason",
      purpose: "Confirm pickup at the correct entrance",
      scope: "One-time precise fix",
      precision: "Precise requested",
      status: "Precise access is tied to a task that needs entrance-level accuracy.",
      age: "Updated now",
      fallback: "Move pin manually",
      privacy: "Saved only on confirmed pickup",
      next: "Confirm pickup point",
      tone: "warn"
    },
    grantedFix: {
      chip: "Granted",
      title: "Current location is shown with accuracy",
      purpose: "Check in near Gate B",
      scope: "One-time grant",
      precision: "42 m accuracy",
      status: "The acquired location is summarized as a place with accuracy and timestamp.",
      age: "Updated just now",
      fallback: "Change location",
      privacy: "Discard after check-in",
      next: "Confirm Gate B",
      tone: "safe"
    },
    denied: {
      chip: "Denied",
      title: "Denial keeps the route task alive",
      purpose: "Estimate route from current area",
      scope: "Permission denied",
      precision: "No coordinate",
      status: "Manual address, saved places, retry, and help remain available after denial.",
      age: "No fix",
      fallback: "Enter start address",
      privacy: "No location collected",
      next: "Continue manually",
      tone: "neutral"
    },
    settingsRecovery: {
      chip: "Settings recovery",
      title: "Previously denied access has a recovery path",
      purpose: "Use current location for check-in",
      scope: "Blocked in browser settings",
      precision: "User controls precise access",
      status: "The flow explains settings recovery without making it the only way forward.",
      age: "No active fix",
      fallback: "Saved home or address",
      privacy: "Retry only after user changes settings",
      next: "Open settings help",
      tone: "neutral"
    },
    timeout: {
      chip: "Timeout",
      title: "Location timed out without losing progress",
      purpose: "Find nearest pickup zone",
      scope: "Request expired",
      precision: "Could not resolve",
      status: "Timeout exposes retry, manual entry, and approximate search instead of spinning forever.",
      age: "No fresh fix",
      fallback: "Search by place",
      privacy: "No coordinate stored",
      next: "Retry for 8 seconds",
      tone: "warn"
    },
    staleLocation: {
      chip: "Stale location",
      title: "Cached coordinates are labeled honestly",
      purpose: "Resume route estimate",
      scope: "Cached coordinate",
      precision: "85 m accuracy",
      status: "The flow labels stale location age and asks for refresh before consequential use.",
      age: "Last updated 46 min ago",
      fallback: "Refresh or enter address",
      privacy: "Cached locally",
      next: "Refresh current location",
      tone: "warn"
    },
    manualFallback: {
      chip: "Manual fallback",
      title: "Address entry is a first-class path",
      purpose: "Start route without device location",
      scope: "No permission needed",
      precision: "Address or ZIP",
      status: "Manual entry solves the task without forcing users to change permission settings.",
      age: "User supplied",
      fallback: "Saved places",
      privacy: "No device coordinate",
      next: "Use typed address",
      tone: "safe"
    },
    savedPlace: {
      chip: "Saved place",
      title: "Saved locations reduce repeated prompts",
      purpose: "Start from a known place",
      scope: "Account place selection",
      precision: "Saved address",
      status: "Saved places avoid unnecessary current-location requests when the user has a known start.",
      age: "Updated by user",
      fallback: "Use current location",
      privacy: "Managed in places",
      next: "Use Home",
      tone: "safe"
    },
    activeTracking: {
      chip: "Active tracking",
      title: "Tracking stays visible while it runs",
      purpose: "Share trip progress until arrival",
      scope: "While route is open",
      precision: "Street-level updates",
      status: "A persistent indicator and stop control remain visible during watch-position updates.",
      age: "Updated 12 sec ago",
      fallback: "Pause sharing",
      privacy: "Visible to trip members",
      next: "Stop sharing",
      tone: "warn",
      tracking: true
    },
    stopSharing: {
      chip: "Stop sharing",
      title: "Users can end location sharing clearly",
      purpose: "End trip progress updates",
      scope: "Watch stopped",
      precision: "No new coordinates",
      status: "Stopping sharing ends active updates and confirms what remains visible.",
      age: "Stopped just now",
      fallback: "Share again",
      privacy: "Last shared point retained for trip record",
      next: "Return to route",
      tone: "safe"
    },
    retention: {
      chip: "Retention",
      title: "Storage purpose and duration are explicit",
      purpose: "Check-in audit for a completed route",
      scope: "Confirmed point only",
      precision: "Place and timestamp",
      status: "Retention copy names what is stored, why, for how long, and where to delete it.",
      age: "Stored after confirm",
      fallback: "Delete in privacy settings",
      privacy: "30-day retention",
      next: "Review privacy settings",
      tone: "neutral"
    },
    offline: {
      chip: "Offline",
      title: "Connectivity is separated from permission",
      purpose: "Load route after location fix",
      scope: "Location may work locally",
      precision: "Fix unavailable to server",
      status: "The UI distinguishes no network from denied location and keeps local fallback visible.",
      age: "Cached 3 min ago",
      fallback: "Save start locally",
      privacy: "No upload until online",
      next: "Retry network",
      tone: "neutral"
    }
  };
  const item = config[mode];
  const titleId = `location-permission-title-${idSuffix}`;
  const descId = `location-permission-desc-${idSuffix}`;

  return (
    <section className={`location-permission-shell is-${item.tone ?? "neutral"} ${item.tracking ? "is-tracking" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="location-permission-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <button type="button" className="location-permission-action">{item.next}</button>
      </header>
      <div className="location-permission-grid" id={descId}>
        <div className="location-permission-map" aria-label="Current location preview">
          <span className="location-permission-pulse"></span>
          <strong>{item.tracking ? "Sharing active" : "Current location"}</strong>
          <small>{item.age}</small>
        </div>
        <div className="location-permission-details">
          <div><span>Purpose</span><strong>{item.purpose}</strong></div>
          <div><span>Scope</span><strong>{item.scope}</strong></div>
          <div><span>Precision</span><strong>{item.precision}</strong></div>
          <div><span>Fallback</span><strong>{item.fallback}</strong></div>
          <div><span>Privacy</span><strong>{item.privacy}</strong></div>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </section>
  );
}

function LocationPermissionFlowGoodUi() {
  return (
    <div className="quality-example location-permission-demo">
      <LocationPermissionPanel mode="grantedFix" idSuffix="good-ui" />
    </div>
  );
}

function LocationPermissionFlowBadUi() {
  return (
    <div className="bad-ui-sample location-permission-bad-ui">
      <section className="location-permission-shell bad" aria-label="Broken location permission interface">
        <header className="location-permission-header">
          <div>
            <span>Location required</span>
            <strong>Exact GPS needed now</strong>
          </div>
          <button type="button" className="location-permission-action danger">Allow precise location</button>
        </header>
        <p>The page prompts on load, asks for exact and background location before purpose, hides manual address entry, and gives no route after denial.</p>
        <div className="location-permission-details compact">
          <div><span>Purpose</span><strong>Unstated before prompt</strong></div>
          <div><span>Precision</span><strong>Precise forced</strong></div>
          <div><span>Fallback</span><strong>Missing</strong></div>
          <div><span>Retention</span><strong>Not disclosed</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI turns current-location access into a blocking, overbroad permission ask.</p>
    </div>
  );
}

function LocationPermissionFlowGoodUx() {
  const [mode, setMode] = useState<LocationPermissionMode>("prePrompt");

  return (
    <div className="quality-example location-permission-demo">
      <div className="demo-row location-permission-controls" aria-label="Location permission exercise controls">
        {locationPermissionGoodLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <LocationPermissionPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Location permission flow state: {locationPermissionGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function LocationPermissionFlowBadUx() {
  const [mode, setMode] = useState<LocationPermissionBadMode>("coldStart");
  const copy: Record<LocationPermissionBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    coldStart: {
      title: "Cold-start ask",
      body: "The browser location prompt appears on the home page before users choose nearby search, route check-in, or any location-dependent task.",
      consequence: "Users deny the prompt because the value, scope, and fallback are unclear.",
      metric: "Prompt on load"
    },
    forcedPrecise: {
      title: "Forced precise",
      body: "The flow requires exact GPS for store sorting even though approximate location, ZIP, or saved city would work.",
      consequence: "The product spends privacy budget on precision the task does not need.",
      metric: "No approximate path"
    },
    noFallback: {
      title: "No fallback",
      body: "After denial, the route screen is a blank map with no address entry, saved place, place search, retry, or help.",
      consequence: "Permission denial blocks a task that could continue manually.",
      metric: "Dead end"
    },
    staleCoordinate: {
      title: "Stale coordinate",
      body: "A cached coordinate from yesterday is shown as current location with no timestamp, accuracy label, or refresh action.",
      consequence: "Users make location decisions from outdated context.",
      metric: "Age hidden"
    },
    backgroundSurprise: {
      title: "Background surprise",
      body: "After a while-using prompt, the app starts trip sharing in the background without a persistent indicator or Stop sharing control.",
      consequence: "Location tracking continues beyond the user-visible task.",
      metric: "Tracking hidden"
    },
    settingsDeadEnd: {
      title: "Settings dead end",
      body: "Previously denied access shows only Enable in settings, with no platform-specific guidance and no manual route alternative.",
      consequence: "Recovery depends on settings navigation even when manual input would work.",
      metric: "Recovery blocked"
    },
    retainedLocation: {
      title: "Retained location",
      body: "The app keeps raw latitude and longitude after check-in without purpose, duration, deletion path, or privacy settings link.",
      consequence: "Sensitive location data persists after the task without informed control.",
      metric: "Retention hidden"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example location-permission-bad-ux is-${mode}`}>
      <div className="demo-row location-permission-controls" aria-label="Location permission misuse controls">
        {locationPermissionBadLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="location-permission-shell bad" aria-label={`Location permission failure: ${item.title}`}>
        <header className="location-permission-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.metric}</strong>
          </div>
          <button type="button" className="location-permission-action danger">Allow exact GPS</button>
        </header>
        <p>{item.body}</p>
        <div className="location-permission-details compact">
          <div><span>Timing</span><strong>{mode === "coldStart" ? "Too early" : "Unclear"}</strong></div>
          <div><span>Precision</span><strong>{mode === "forcedPrecise" ? "Overbroad" : "Not explained"}</strong></div>
          <div><span>Fallback</span><strong>{mode === "noFallback" || mode === "settingsDeadEnd" ? "Missing" : "Weak"}</strong></div>
          <div><span>Retention</span><strong>{mode === "retainedLocation" ? "Hidden" : "Not stated"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LocationPermissionFlowGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LocationPermissionFlowBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LocationPermissionFlowGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LocationPermissionFlowBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
