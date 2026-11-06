import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type LayoutMode = "split" | "focus" | "stacked" | "inspector" | "managed" | "unsafe";

type LayoutRegion = {
  id: string;
  title: string;
  meta: string;
  detail: string;
};

const layoutRegions: LayoutRegion[] = [
  {
    id: "queue",
    title: "Queue",
    meta: "Filter: SLA risk",
    detail: "Selected case remains INV-204 after layout changes."
  },
  {
    id: "case",
    title: "Case INV-204",
    meta: "Draft reply: unsaved",
    detail: "Refund evidence needs a manager note before approval."
  },
  {
    id: "activity",
    title: "Activity",
    meta: "Scroll anchor: latest note",
    detail: "Mira added billing context and attached the dispute receipt."
  }
];

const layoutModeCopy: Record<LayoutMode, { label: string; scope: string; note: string }> = {
  split: {
    label: "Split layout",
    scope: "This workspace",
    note: "Queue, case, and activity stay side by side with the selected case and draft preserved."
  },
  focus: {
    label: "Focus layout",
    scope: "Temporary",
    note: "Case editor gets priority while queue and activity remain recoverable through region controls."
  },
  stacked: {
    label: "Stacked layout",
    scope: "Mobile fallback",
    note: "Regions stack in task order with labelled navigation instead of horizontal scrolling."
  },
  inspector: {
    label: "Inspector right",
    scope: "Personal preview",
    note: "Activity moves beside the case as an inspector without changing filters or saved view."
  },
  managed: {
    label: "Managed layout",
    scope: "Workspace policy",
    note: "Layout owner is visible and personal save is disabled until policy changes."
  },
  unsafe: {
    label: "Unavailable layout",
    scope: "Narrow screen",
    note: "Side-by-side layout is blocked because it would hide validation and pane controls."
  }
};

function LayoutWorkspace({
  mode,
  edited = true
}: {
  mode: LayoutMode;
  edited?: boolean;
}) {
  const copy = layoutModeCopy[mode];
  const visibleRegions = mode === "focus" ? layoutRegions.filter((region) => region.id === "case") : layoutRegions;

  return (
    <section className={`user-layout-workspace is-${mode}`} aria-label="Case review workspace">
      <header className="user-layout-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.note}</span>
        </div>
        <span className="user-layout-scope">{copy.scope}</span>
      </header>
      <div className="user-layout-regions">
        {visibleRegions.map((region) => (
          <article key={region.id} className={`user-layout-region is-${region.id} ${edited && region.id === "case" ? "is-edited" : ""}`}>
            <div>
              <strong>{region.title}</strong>
              <span>{region.meta}</span>
            </div>
            <p>{region.detail}</p>
            {region.id === "case" ? <button type="button" className="demo-button small">Continue draft</button> : <button type="button" className="demo-button small">Open region</button>}
          </article>
        ))}
      </div>
      {mode === "focus" ? (
        <nav className="user-layout-region-nav" aria-label="Hidden workspace regions">
          <button type="button" className="demo-button small">Return to queue</button>
          <button type="button" className="demo-button small">Open activity</button>
        </nav>
      ) : null}
    </section>
  );
}

function UserControlledLayoutGoodUi() {
  return (
    <div className="quality-example user-layout-demo">
      <div className="user-layout-toolbar" aria-label="Layout selector preview">
        <button type="button" className="demo-button small primary">Split</button>
        <button type="button" className="demo-button small">Focus</button>
        <button type="button" className="demo-button small">Stacked</button>
        <button type="button" className="demo-button small">Inspector</button>
        <button type="button" className="demo-button small">Reset</button>
      </div>
      <LayoutWorkspace mode="split" />
      <p className="demo-status">The layout selector names each arrangement, shows scope, keeps regions labelled, and preserves the selected case, filter, draft, validation, and return path.</p>
    </div>
  );
}

function UserControlledLayoutBadUi() {
  return (
    <div className="bad-ui-sample user-layout-bad-demo is-unlabeled">
      <div className="user-layout-broken-grid">
        {["▣", "▤", "?", "Hidden pane"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken UI uses unnamed layout icons and hides a pane without showing scope, current layout, reset, or a return path.</p>
    </div>
  );
}

function UserControlledLayoutGoodUx() {
  const [mode, setMode] = useState<LayoutMode>("split");
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(true);
  const [message, setMessage] = useState("Layout changes arrangement only; selected case, filters, draft, validation, scroll, and focus stay intact.");

  const choose = (next: LayoutMode, note: string) => {
    setMode(next);
    setMessage(note);
  };

  return (
    <div className="quality-example user-layout-demo">
      <div className="user-layout-toolbar" aria-label="User layout controls">
        <button type="button" className={mode === "split" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("split", "Split layout restored queue, case, and activity side by side without changing filters.")}>Split</button>
        <button type="button" className={mode === "focus" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("focus", "Focus layout hides secondary panes but keeps queue and activity available through return controls.")}>Focus</button>
        <button type="button" className={mode === "stacked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stacked", "Stacked layout keeps region order reachable on narrow screens with no horizontal scroll.")}>Stacked</button>
        <button type="button" className={mode === "inspector" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("inspector", "Inspector layout moves activity beside the case while preserving saved view and draft state.")}>Inspector</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(false);
          choose("inspector", "Previewing inspector layout for this workspace only; personal save is separate.");
        }}>Preview inspector</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(true);
          setMessage("Layout saved for this user account only; team dashboard, filters, and saved views were not changed.");
        }}>Save personal</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(false);
          setEdited(true);
          choose("split", "Reset restored only workspace layout to the default split arrangement.");
        }}>Reset layout</button>
        <button type="button" className="demo-button small" onClick={() => choose("managed", "Workspace-managed layout explains policy owner and disables personal save.")}>Managed</button>
        <button type="button" className="demo-button small" onClick={() => choose("unsafe", "Side-by-side layout is unavailable because mobile width would hide validation and activity controls.")}>Unsafe mobile</button>
        <button type="button" className="demo-button small" onClick={() => {
          setEdited(true);
          setMessage("Unsaved reply draft, validation warning, selected case, filter, and scroll anchor remain after layout changes.");
        }}>Preserve draft</button>
      </div>
      <LayoutWorkspace mode={mode} edited={edited} />
      <p className="demo-status" aria-live="polite">{saved ? "Saved personal layout. " : ""}{message}</p>
    </div>
  );
}

function UserControlledLayoutBadUx() {
  type Mode = "unlabeled" | "state-loss" | "shared-overwrite" | "saved-view-mix" | "splitter-confusion" | "mobile-offscreen" | "no-reset";
  const [mode, setMode] = useState<Mode>("unlabeled");
  const copy: Record<Mode, string> = {
    unlabeled: "Layout controls are icon-only, so users cannot tell which panes will move or hide.",
    "state-loss": "Switching to focus layout clears the selected case, draft reply, validation, and activity scroll.",
    "shared-overwrite": "A personal inspector layout becomes the workspace default for every teammate without warning.",
    "saved-view-mix": "The product stores layout with filters, columns, density, and sort, so reset cannot target layout only.",
    "splitter-confusion": "A splitter width is labelled as a layout preset even though region order and visibility never change.",
    "mobile-offscreen": "Desktop split layout is copied to mobile and leaves the activity pane off screen.",
    "no-reset": "Users can switch layouts but cannot return to default or see which scope changed."
  };
  const labels: Record<Mode, string[]> = {
    unlabeled: ["▣", "▤", "?", "Hidden"],
    "state-loss": ["Case lost", "Draft gone", "Filter reset", "Top"],
    "shared-overwrite": ["My layout", "Team changed", "No owner", "No undo"],
    "saved-view-mix": ["Layout view", "Columns gone", "Density reset", "Sort changed"],
    "splitter-confusion": ["60%", "40%", "No focus", "No stack"],
    "mobile-offscreen": ["Queue", "Case", "Activity ->", "Off screen"],
    "no-reset": ["Split", "Focus", "Default?", "No reset"]
  };

  return (
    <div className={`quality-example user-layout-bad-demo is-${mode}`}>
      <div className="user-layout-broken-grid">
        {labels[mode].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <strong>{mode === "shared-overwrite" ? "Shared layout changed" : mode === "saved-view-mix" ? "View and layout mixed" : "Layout failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row user-layout-controls">
        <button type="button" className={mode === "unlabeled" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unlabeled")}>Unlabeled</button>
        <button type="button" className={mode === "state-loss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("state-loss")}>State loss</button>
        <button type="button" className={mode === "shared-overwrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("shared-overwrite")}>Shared overwrite</button>
        <button type="button" className={mode === "saved-view-mix" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("saved-view-mix")}>Saved view mix</button>
        <button type="button" className={mode === "splitter-confusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("splitter-confusion")}>Splitter confusion</button>
        <button type="button" className={mode === "mobile-offscreen" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobile-offscreen")}>Mobile offscreen</button>
        <button type="button" className={mode === "no-reset" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-reset")}>No reset</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledLayoutGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledLayoutBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledLayoutGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledLayoutBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
