import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SettingsManagementStage = "overview" | "immediate" | "unsaved" | "search" | "managed" | "reset" | "failed" | "saved";

function SettingsManagementFrame({
  stage = "overview",
  unsaved = false,
  digest = "Weekly",
  focusAlerts = true,
  idSuffix = "default"
}: {
  stage?: SettingsManagementStage;
  unsaved?: boolean;
  digest?: "Daily" | "Weekly" | "Off";
  focusAlerts?: boolean;
  idSuffix?: string;
}) {
  const title: Record<SettingsManagementStage, string> = {
    overview: "Workspace settings",
    immediate: "Notification preference applied",
    unsaved: "Unsaved display changes",
    search: "Search found retention policy",
    managed: "Organization-managed setting",
    reset: "Notification defaults restored",
    failed: "Save failed; changes preserved",
    saved: "Settings saved"
  };
  const status: Record<SettingsManagementStage, string> = {
    overview: "Current values are visible before editing.",
    immediate: "Focus alerts changed immediately for this workspace.",
    unsaved: "Theme and density edits are staged until Save changes.",
    search: "Rare settings deep-link to their owning section.",
    managed: "Retention is inherited from the organization policy.",
    reset: "Only notification settings were reset to defaults.",
    failed: "The draft remains editable while the save error is resolved.",
    saved: "Explicit-save settings now match the persisted values."
  };
  const settingsRows = [
    { name: "Focus alerts", value: focusAlerts ? "On" : "Off", scope: "Workspace", kind: "Immediate" },
    { name: "Digest email", value: digest, scope: "Account", kind: "Save" },
    { name: "Theme density", value: unsaved ? "Compact draft" : "Comfortable", scope: "Device", kind: unsaved ? "Unsaved" : "Saved" },
    { name: "Data retention", value: "180 days", scope: "Organization", kind: "Managed" }
  ];

  return (
    <div className={`settings-management-frame is-${stage}`}>
      <aside className="settings-management-nav" aria-label="Settings sections">
        {["Account", "Notifications", "Privacy", "Display", "Integrations"].map((section) => (
          <span className={section === "Notifications" || (stage === "managed" && section === "Privacy") ? "is-current" : ""} key={section}>{section}</span>
        ))}
      </aside>
      <section className="settings-management-panel" aria-labelledby={`settings-management-title-${idSuffix}`}>
        <div className="settings-management-heading">
          <span>{unsaved ? "Draft changes" : "Authoritative values"}</span>
          <strong>{stage === "failed" ? "Save failed" : stage === "saved" || stage === "immediate" ? "Applied" : "Inspectable"}</strong>
        </div>
        <h4 id={`settings-management-title-${idSuffix}`}>{title[stage]}</h4>
        <p>{status[stage]}</p>
        <label className="settings-management-search">
          <span>Find a setting</span>
          <input value={stage === "search" ? "retention" : ""} placeholder="Search settings" readOnly />
        </label>
        <div className="settings-management-list">
          {settingsRows.map((row) => (
            <div className={row.kind === "Managed" ? "is-managed" : row.kind === "Unsaved" ? "is-unsaved" : row.kind === "Immediate" ? "is-immediate" : ""} key={row.name}>
              <span>{row.name}</span>
              <strong>{row.value}</strong>
              <em>{row.scope} · {row.kind}</em>
            </div>
          ))}
        </div>
        <div className="settings-management-summary">
          <span>{stage === "managed" ? "Managed by Acme Org. Request policy changes from workspace admins." : stage === "failed" ? "Could not save digest email. Your Daily draft is still here." : stage === "reset" ? "Notifications returned to workspace defaults; display settings were unchanged." : "Scope and save model are shown beside every setting."}</span>
        </div>
      </section>
    </div>
  );
}

function SettingsManagementGoodUi() {
  return (
    <div className="quality-example settings-management-demo">
      <SettingsManagementFrame idSuffix="good-ui" />
      <p className="demo-status">The settings surface groups durable preferences, shows current values, scope, save model, search, managed state, and recovery status.</p>
    </div>
  );
}

function SettingsManagementBadUi() {
  return (
    <div className="bad-ui-sample settings-management-bad-demo is-dumpingGround">
      <strong>Settings</strong>
      <div className="settings-management-bad-grid">
        {["Invoices", "Delete account", "Tour tips", "Profile photo", "Alert switch", "Random JSON"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The page is a dumping ground with unrelated destinations, no current values, no scope labels, and no save model.</p>
    </div>
  );
}

function SettingsManagementGoodUx() {
  const [stage, setStage] = useState<SettingsManagementStage>("overview");
  const [unsaved, setUnsaved] = useState(false);
  const [digest, setDigest] = useState<"Daily" | "Weekly" | "Off">("Weekly");
  const [focusAlerts, setFocusAlerts] = useState(true);
  const [message, setMessage] = useState("Settings open with persisted current values, grouped by task language.");

  function choose(nextStage: SettingsManagementStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example settings-management-demo">
      <SettingsManagementFrame stage={stage} unsaved={unsaved} digest={digest} focusAlerts={focusAlerts} idSuffix="good-ux" />
      <div className="demo-row settings-management-controls" aria-label="Settings management exercise controls">
        <button type="button" className={stage === "overview" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("overview", "Overview shows categories, current values, scope, and whether each setting is immediate or saved.")}>Overview</button>
        <button type="button" className={stage === "immediate" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setFocusAlerts(!focusAlerts);
          choose("immediate", "The Focus alerts setting applies immediately and reports the workspace scope.");
        }}>Immediate apply</button>
        <button type="button" className={unsaved ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setUnsaved(true);
          setDigest("Daily");
          choose("unsaved", "Digest and display changes are staged, marked unsaved, and protected before navigation.");
        }}>Stage changes</button>
        <button type="button" className={stage === "search" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("search", "Search for retention jumps to the owning Privacy setting without losing unsaved changes.")}>Search</button>
        <button type="button" className={stage === "managed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("managed", "Managed retention is read-only, names the organization owner, and gives a request-change route.")}>Managed</button>
        <button type="button" className={stage === "reset" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setDigest("Weekly");
          setFocusAlerts(true);
          choose("reset", "Reset defaults affects only the notification group and leaves unrelated display settings alone.");
        }}>Reset group</button>
        <button type="button" className={stage === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "A failed save preserves the Daily digest draft and moves recovery to the owning setting.")}>Failed save</button>
        <button type="button" className={stage === "saved" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setUnsaved(false);
          choose("saved", "Save commits explicit-save settings and clears the unsaved-change warning.");
        }}>Save</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SettingsManagementBadUx() {
  type Mode = "dumpingGround" | "mixedSave" | "wrongScope" | "hiddenCurrent" | "broadReset" | "lostUnsaved";
  const [mode, setMode] = useState<Mode>("dumpingGround");
  const copy: Record<Mode, string> = {
    dumpingGround: "Settings became a dumping ground for unrelated navigation, billing, help, profile setup, and destructive commands.",
    mixedSave: "Some rows apply immediately and others require Save, but the page uses the same status for every control.",
    wrongScope: "A local-looking project setting changes the whole organization without a scope warning.",
    hiddenCurrent: "Users must open edit mode on every row just to learn the current configured value.",
    broadReset: "Reset display defaults also clears notifications, privacy choices, and account preferences.",
    lostUnsaved: "Leaving the section silently discards staged settings without warning or recovery."
  };
  const labels: Record<Mode, string[]> = {
    dumpingGround: ["Billing", "Delete", "Tour", "Profile"],
    mixedSave: ["Instant", "Needs Save", "Restart", "Same UI"],
    wrongScope: ["Project page", "Org-wide", "No warning"],
    hiddenCurrent: ["Edit to view", "Blank rows", "No status"],
    broadReset: ["Reset display", "Privacy cleared", "Alerts cleared"],
    lostUnsaved: ["Draft Daily", "Navigate away", "Discarded"]
  };
  return (
    <div className={`quality-example settings-management-bad-demo is-${mode}`}>
      <strong>{mode === "wrongScope" ? "Project settings" : mode === "broadReset" ? "Reset settings" : "Settings"}</strong>
      <div className="settings-management-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row settings-management-controls">
        <button type="button" className={mode === "dumpingGround" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dumpingGround")}>Dumping ground</button>
        <button type="button" className={mode === "mixedSave" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedSave")}>Mixed save</button>
        <button type="button" className={mode === "wrongScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongScope")}>Wrong scope</button>
        <button type="button" className={mode === "hiddenCurrent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenCurrent")}>Hidden current</button>
        <button type="button" className={mode === "broadReset" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("broadReset")}>Broad reset</button>
        <button type="button" className={mode === "lostUnsaved" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostUnsaved")}>Lost unsaved</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsManagementGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsManagementBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsManagementGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsManagementBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
