import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type VersionHistoryMode = "current" | "named" | "compare" | "restore" | "restored" | "retention" | "permission" | "draftConflict" | "deletedAuthor" | "mobile";

const versionHistoryCopy: Record<VersionHistoryMode, {
  title: string;
  selected: string;
  status: string;
  detail: string;
  note: string;
  diff: string[];
}> = {
  current: {
    title: "Checkout flow spec",
    selected: "v42 Current",
    status: "Current version",
    detail: "Latest saved state from Priya Raman, today 14:18. Restore actions are disabled until a previous version is selected.",
    note: "Current remains visible while browsing older snapshots.",
    diff: ["Baseline for compare", "Published draft not changed", "Comments remain attached"]
  },
  named: {
    title: "Pre-launch copy",
    selected: "v38 Named",
    status: "Named version",
    detail: "Named by Maya Chen before launch copy review. The label helps the team find the known good content later.",
    note: "Named versions are distinct from autosaves and ordinary edits.",
    diff: ["Button copy: Place order", "Help text restored", "Risk note still present"]
  },
  compare: {
    title: "Compare v42 with v38",
    selected: "v38 Named",
    status: "Compare preview",
    detail: "The preview names both versions and shows what would change before any restore action runs.",
    note: "Compare is a review step, not a restore.",
    diff: ["Removed: guest checkout warning", "Added: tax estimate note", "Changed: final CTA label"]
  },
  restore: {
    title: "Restore confirmation",
    selected: "v38 Named",
    status: "Restore requires confirmation",
    detail: "Restoring v38 will create v43 as the current version. v42 remains available in version history.",
    note: "Users see the target version and recovery model before confirming.",
    diff: ["New current version will be created", "Current draft warning checked", "Publish state stays draft"]
  },
  restored: {
    title: "Restored checkout flow spec",
    selected: "v43 Current",
    status: "Restored just now",
    detail: "The restored state names the source version and keeps the previous current version available.",
    note: "Restore success points back to v38 and v42.",
    diff: ["Created from v38", "v42 recoverable", "Activity event recorded"]
  },
  retention: {
    title: "Older history unavailable",
    selected: "Before v31",
    status: "Retention limit",
    detail: "Versions older than 180 days are archived by policy. Request archive access instead of implying the version never existed.",
    note: "Retention state explains missing previous versions.",
    diff: ["Archive required", "Metadata retained", "Content preview unavailable"]
  },
  permission: {
    title: "Read-only version access",
    selected: "v41 Previous",
    status: "Restore blocked",
    detail: "The reviewer can inspect metadata but needs edit permission to compare restricted content or restore this version.",
    note: "Permission limits hide only unavailable actions and details.",
    diff: ["Author visible", "Diff restricted", "Restore unavailable"]
  },
  draftConflict: {
    title: "Draft conflict",
    selected: "v38 Named",
    status: "Unsaved edits detected",
    detail: "A current draft from Dana must be saved, discarded, or copied before restore can proceed.",
    note: "Draft state is handled before rollback.",
    diff: ["Unsaved checkout copy", "Collaborator editing now", "Restore paused"]
  },
  deletedAuthor: {
    title: "Former author",
    selected: "v35 Autosaved",
    status: "Author unavailable",
    detail: "The version remains usable even though the author account was removed. Private profile details stay hidden.",
    note: "Deleted authors do not erase version identity.",
    diff: ["Author: former member", "Autosaved at 09:12", "Restore allowed"]
  },
  mobile: {
    title: "Condensed version list",
    selected: "v38 Named",
    status: "Mobile compare ready",
    detail: "The list collapses into rows with current, selected, compare, and restore status preserved.",
    note: "Small screens keep consequence copy visible.",
    diff: ["Current row pinned", "Selected row expanded", "Restore button labelled"]
  }
};

function VersionHistoryFrame({
  mode = "current",
  idSuffix = "demo"
}: {
  mode?: VersionHistoryMode;
  idSuffix?: string;
}) {
  const copy = versionHistoryCopy[mode];
  const titleId = `version-history-title-${idSuffix}`;
  const versions = [
    { id: "v42", label: "v42", meta: "Current - Priya - Today 14:18", kind: "Current", active: mode === "current" || mode === "restored" },
    { id: "v41", label: "v41", meta: "Previous - Omar - Today 11:07", kind: "Autosaved", active: mode === "permission" },
    { id: "v38", label: "v38", meta: "Named - Maya - Yesterday 17:40", kind: "Pre-launch copy", active: mode === "named" || mode === "compare" || mode === "restore" || mode === "draftConflict" || mode === "mobile" },
    { id: "v35", label: "v35", meta: "Autosaved - former member - Mon 09:12", kind: "Autosaved", active: mode === "deletedAuthor" },
    { id: "archive", label: "Before v31", meta: "Archived by 180-day retention", kind: "Archive", active: mode === "retention" }
  ];
  return (
    <div className={`version-history-frame is-${mode}`}>
      <section className="version-history-list" aria-labelledby={titleId}>
        <div className="version-history-head">
          <span>Design spec file</span>
          <strong>{copy.status}</strong>
        </div>
        <h4 id={titleId}>Checkout flow spec</h4>
        <div className="version-history-items" role="list" aria-label="Saved versions">
          {versions.map((version) => (
            <button
              type="button"
              role="listitem"
              key={version.id}
              className={`version-history-item ${version.active ? "is-selected" : ""} ${version.kind === "Current" ? "is-current" : ""} ${version.kind === "Archive" ? "is-muted" : ""}`}
              aria-current={version.kind === "Current" ? "true" : undefined}
            >
              <span>{version.label}</span>
              <b>{version.kind}</b>
              <em>{version.meta}</em>
            </button>
          ))}
        </div>
      </section>
      <aside className="version-history-detail" aria-label="Selected version detail">
        <div className="version-history-meta">
          <span>Selected</span>
          <strong>{copy.selected}</strong>
        </div>
        <h4>{copy.title}</h4>
        <p>{copy.detail}</p>
        <div className="version-history-diff" aria-label="Version compare summary">
          {copy.diff.map((line) => <span key={line}>{line}</span>)}
        </div>
        <div className={mode === "permission" || mode === "retention" || mode === "draftConflict" ? "version-history-note is-warning" : "version-history-note"}>
          {copy.note}
        </div>
        <div className="version-history-actions">
          <button type="button" className="demo-button small">Compare</button>
          <button type="button" className="demo-button small primary" disabled={mode === "current" || mode === "permission" || mode === "retention" || mode === "draftConflict"}>Restore</button>
        </div>
      </aside>
    </div>
  );
}

function VersionHistoryGoodUi() {
  return (
    <div className="quality-example version-history-demo">
      <VersionHistoryFrame mode="compare" />
      <p className="demo-status">The browser keeps the current version visible, separates named and autosaved versions, and previews compare and restore consequences.</p>
    </div>
  );
}

function VersionHistoryBadUi() {
  return (
    <div className="bad-ui-sample version-history-bad-demo is-auditLogConfusion">
      <strong>History</strong>
      <div className="version-history-bad-grid">
        {["Edited", "Edited again", "Changed stuff", "Restore now"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken panel lists events without current version, previous version preview, named version labels, compare, or restore consequences.</p>
    </div>
  );
}

function VersionHistoryGoodUx() {
  const [mode, setMode] = useState<VersionHistoryMode>("current");
  const [message, setMessage] = useState("The current version is pinned before a previous version is selected.");
  function choose(nextMode: VersionHistoryMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example version-history-demo">
      <VersionHistoryFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row version-history-controls" aria-label="Version history exercise controls">
        <button type="button" className={mode === "current" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("current", "The current version remains visible and restore stays disabled until a previous version is selected.")}>Current</button>
        <button type="button" className={mode === "named" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("named", "A named version carries a human label so the known good state is findable.")}>Named</button>
        <button type="button" className={mode === "compare" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("compare", "Compare names both versions and lists concrete changes before restore.")}>Compare</button>
        <button type="button" className={mode === "restore" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("restore", "Restore confirmation explains that v38 will create a new current version.")}>Restore</button>
        <button type="button" className={mode === "restored" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("restored", "Restored state names the source version and keeps the prior current version recoverable.")}>Confirmed</button>
        <button type="button" className={mode === "retention" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retention", "Retention explains why older previous versions are archived instead of missing silently.")}>Retention</button>
        <button type="button" className={mode === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Permission state shows metadata while blocking restricted compare and restore actions.")}>Permission</button>
        <button type="button" className={mode === "draftConflict" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("draftConflict", "Draft conflict pauses restore until current unsaved work is handled.")}>Draft conflict</button>
        <button type="button" className={mode === "deletedAuthor" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("deletedAuthor", "Deleted author state keeps version identity without exposing private profile details.")}>Deleted author</button>
        <button type="button" className={mode === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile state preserves current, selected, compare, restore, and consequence text in condensed rows.")}>Mobile</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function VersionHistoryBadUx() {
  type Mode = "auditLogConfusion" | "noCompare" | "restoreNoPreview" | "hiddenCurrent" | "permissionLeak" | "undoConfusion";
  const [mode, setMode] = useState<Mode>("auditLogConfusion");
  const copy: Record<Mode, string> = {
    auditLogConfusion: "The panel lists edit events but no durable previous version to preview or restore.",
    noCompare: "The user must restore blind because the UI cannot show what differs from the current version.",
    restoreNoPreview: "Restore runs immediately without preview, selected version label, or confirmation.",
    hiddenCurrent: "Browsing old versions hides the current version, so users cannot tell what will be replaced.",
    permissionLeak: "A read-only viewer sees restricted diff text and author details from a private version.",
    undoConfusion: "The product offers only undo even though the user needs a previous version from yesterday."
  };
  const labels: Record<Mode, string[]> = {
    auditLogConfusion: ["Edited", "Renamed", "Shared"],
    noCompare: ["v38", "No diff", "Guess"],
    restoreNoPreview: ["Restore", "Now", "No confirm"],
    hiddenCurrent: ["Old v38", "Old v35", "Current hidden"],
    permissionLeak: ["Private diff", "Former author email", "Restore button"],
    undoConfusion: ["Undo last", "No versions", "Session only"]
  };
  return (
    <div className={`quality-example version-history-bad-demo is-${mode}`}>
      <strong>{mode === "permissionLeak" ? "Permission leak" : mode === "undoConfusion" ? "Undo-only recovery" : "Broken history"}</strong>
      <div className="version-history-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row version-history-controls">
        <button type="button" className={mode === "auditLogConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auditLogConfusion")}>Audit log confusion</button>
        <button type="button" className={mode === "noCompare" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noCompare")}>No compare</button>
        <button type="button" className={mode === "restoreNoPreview" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("restoreNoPreview")}>No preview</button>
        <button type="button" className={mode === "hiddenCurrent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenCurrent")}>Hidden current</button>
        <button type="button" className={mode === "permissionLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("permissionLeak")}>Permission leak</button>
        <button type="button" className={mode === "undoConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("undoConfusion")}>Undo confusion</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VersionHistoryGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VersionHistoryBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VersionHistoryGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VersionHistoryBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
