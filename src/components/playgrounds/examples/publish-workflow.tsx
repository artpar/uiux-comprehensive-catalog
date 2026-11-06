import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PublishWorkflowStage = "draft" | "preview" | "validation" | "blocked" | "target" | "publish" | "schedule" | "reschedule" | "cancel" | "live" | "unpublish" | "rollback" | "permission" | "conflict";

function PublishWorkflowFrame({
  stage = "draft",
  target = "Staging",
  status = "Draft",
  idSuffix = "demo"
}: {
  stage?: PublishWorkflowStage;
  target?: string;
  status?: string;
  idSuffix?: string;
}) {
  const title: Record<PublishWorkflowStage, string> = {
    draft: "Campaign page saved as draft",
    preview: "Preview exact release target",
    validation: "Readiness checks running",
    blocked: "Validation blocks publish",
    target: "Choose where this goes live",
    publish: "Publish to production",
    schedule: "Scheduled for launch",
    reschedule: "Launch time updated",
    cancel: "Scheduled publish canceled",
    live: "Production page is live",
    unpublish: "Retire live page",
    rollback: "Rollback previous version",
    permission: "No permission for production",
    conflict: "Newer live version detected"
  };
  const message: Record<PublishWorkflowStage, string> = {
    draft: "Saving stores the edit but does not change the live page.",
    preview: "Preview uses draft v18 on the selected staging target before production can change.",
    validation: "The workflow checks links, hero media, locale copy, slug, schedule time, and channel eligibility.",
    blocked: "The hero image is missing alt text, so publish and schedule actions stay blocked.",
    target: "The target summary separates staging, production, Online Store, and locale publishing.",
    publish: "Production publish shows affected page, domain, version, cache note, and public visibility.",
    schedule: "The launch is queued for 09:00 IST with target, actor, version, and validation result.",
    reschedule: "Reschedule preserves the same draft version and updates date, time, timezone, and audit trail.",
    cancel: "Cancel schedule keeps the draft intact and prevents the queued job from going live.",
    live: "Live verification exposes the URL and confirms production is showing v18.",
    unpublish: "Unpublish retires the page and warns about links, search, and dependent campaign assets.",
    rollback: "Rollback restores v17 and records the rollback reference.",
    permission: "The user can publish to staging but needs a publisher role for production.",
    conflict: "A newer live version exists, so the workflow requires compare or refresh before publish."
  };
  const rows = [
    { label: "Item", value: "Spring sale landing page", state: stage === "conflict" ? "Draft v18, live v19" : "Draft v18" },
    { label: "Target", value: target, state: target === "Production" ? "Public" : target === "Online Store" ? "Channel" : "Private" },
    { label: "Readiness", value: stage === "blocked" ? "Blocked" : stage === "validation" ? "Checking" : "Passed", state: stage === "blocked" ? "Fix required" : "Current" },
    { label: "Status", value: status, state: stage === "live" ? "Verified" : stage === "schedule" || stage === "reschedule" ? "Queued" : "Editable" }
  ];
  const checks = [
    stage === "blocked" ? "Hero image alt text missing" : "Required fields passed",
    stage === "permission" ? "Production role missing" : "Permission checked",
    stage === "conflict" ? "Compare with newer live v19" : "Version v18 selected",
    stage === "schedule" || stage === "reschedule" ? "Launch 09:00 IST" : stage === "live" ? "Live URL verified" : "Preview available"
  ];

  return (
    <div className={`publish-workflow-frame is-${stage}`}>
      <section className="publish-workflow-panel" aria-labelledby={`publish-workflow-title-${idSuffix}`}>
        <div className="publish-workflow-heading">
          <span>Publish workflow</span>
          <strong>{status}</strong>
        </div>
        <h4 id={`publish-workflow-title-${idSuffix}`}>{title[stage]}</h4>
        <p>{message[stage]}</p>
        <div className="publish-workflow-fields">
          {rows.map((row) => (
            <div className={row.state === "Fix required" || row.state === "Public" || row.state === "Queued" ? "needs-review" : row.state === "Verified" ? "is-live" : ""} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <em>{row.state}</em>
            </div>
          ))}
        </div>
      </section>
      <aside className="publish-workflow-checks" aria-label="Publish readiness checks">
        <strong>{stage === "live" ? "Live verification" : stage === "rollback" ? "Restore point" : "Release checks"}</strong>
        <ul>
          {checks.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>{stage === "publish" || stage === "live" ? "Open live URL · Copy URL · View history" : stage === "schedule" || stage === "reschedule" ? "Reschedule · Cancel schedule · Keep draft" : "Preview · Validate · Choose target"}</p>
      </aside>
    </div>
  );
}

function PublishWorkflowGoodUi() {
  return (
    <div className="quality-example publish-workflow-demo">
      <PublishWorkflowFrame />
      <p className="demo-status">The publish surface separates draft saving from visibility-changing actions and shows target, validation, schedule, live verification, and recovery controls.</p>
    </div>
  );
}

function PublishWorkflowBadUi() {
  return (
    <div className="bad-ui-sample publish-workflow-bad-demo is-wrongTarget">
      <strong>Publish</strong>
      <div className="publish-workflow-bad-grid">
        {["Save", "Publish", "Live?", "All domains", "No preview", "No undo"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken surface hides whether work is saved, scheduled, staged, or live, and never shows target, validation, affected scope, or rollback.</p>
    </div>
  );
}

function PublishWorkflowGoodUx() {
  const [stage, setStage] = useState<PublishWorkflowStage>("draft");
  const [target, setTarget] = useState("Staging");
  const [status, setStatus] = useState("Draft");
  const [message, setMessage] = useState("The campaign page is saved, but the live production page has not changed.");

  function choose(nextStage: PublishWorkflowStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example publish-workflow-demo">
      <PublishWorkflowFrame stage={stage} target={target} status={status} idSuffix="good-ux" />
      <div className="demo-row publish-workflow-controls" aria-label="Publish workflow exercise controls">
        <button type="button" className={stage === "draft" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTarget("Staging");
          setStatus("Draft");
          choose("draft", "Save draft stores v18 and keeps production unchanged.");
        }}>Draft</button>
        <button type="button" className={stage === "preview" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Preview");
          choose("preview", "Preview opens draft v18 on the same target that will be published.");
        }}>Preview</button>
        <button type="button" className={stage === "validation" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Checking");
          choose("validation", "Validation checks links, media, locale copy, slug, channel data, and schedule time before publish.");
        }}>Validate</button>
        <button type="button" className={stage === "blocked" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Blocked");
          choose("blocked", "Missing alt text blocks publish and points to the exact field that must be fixed.");
        }}>Blocked</button>
        <button type="button" className={stage === "target" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTarget("Online Store");
          setStatus("Ready");
          choose("target", "Target selection makes Online Store channel explicit and keeps other channels excluded.");
        }}>Target</button>
        <button type="button" className={stage === "publish" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTarget("Production");
          setStatus("Ready");
          choose("publish", "Production publish names the public domain, affected page, version, and visibility impact before launch.");
        }}>Publish</button>
        <button type="button" className={stage === "schedule" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Scheduled");
          choose("schedule", "Schedule stores date, time, timezone, target, actor, version, and validation result.");
        }}>Schedule</button>
        <button type="button" className={stage === "reschedule" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Rescheduled");
          choose("reschedule", "Reschedule updates launch time while keeping the same draft version and audit trail.");
        }}>Reschedule</button>
        <button type="button" className={stage === "cancel" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Draft");
          choose("cancel", "Cancel schedule stops the queued publish job and leaves the draft editable.");
        }}>Cancel</button>
        <button type="button" className={stage === "live" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTarget("Production");
          setStatus("Live");
          choose("live", "Live verification confirms production is showing v18 and exposes the public URL.");
        }}>Live</button>
        <button type="button" className={stage === "unpublish" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Retiring");
          choose("unpublish", "Unpublish warns about links, search, and campaign dependencies before removing visibility.");
        }}>Unpublish</button>
        <button type="button" className={stage === "rollback" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Rollback");
          choose("rollback", "Rollback restores previous live version v17 and records the recovery action.");
        }}>Rollback</button>
        <button type="button" className={stage === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Denied");
          choose("permission", "A staging editor cannot publish production and gets a clear permission boundary.");
        }}>Permission</button>
        <button type="button" className={stage === "conflict" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Conflict");
          choose("conflict", "A newer live version blocks publish until the editor compares or refreshes.");
        }}>Conflict</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PublishWorkflowBadUx() {
  type Mode = "saveIsLive" | "wrongTarget" | "noValidation" | "silentScheduleFail" | "noRollback" | "stalePublish";
  const [mode, setMode] = useState<Mode>("saveIsLive");
  const copy: Record<Mode, string> = {
    saveIsLive: "Save, Submit, Schedule, and Publish use the same language, so users cannot tell whether anything is live.",
    wrongTarget: "The page publishes to every domain and channel because target selection is hidden.",
    noValidation: "Publish accepts a missing hero image, broken link, and untranslated locale without blocking or pointing to fields.",
    silentScheduleFail: "A scheduled launch fails validation at release time and nobody sees a failed schedule state.",
    noRollback: "A bad production release has no live verification, unpublish, rollback, or previous-version reference.",
    stalePublish: "Old draft v18 overwrites newer live v19 because the workflow never checked version conflict."
  };
  const labels: Record<Mode, string[]> = {
    saveIsLive: ["Save", "Submit", "Done"],
    wrongTarget: ["All domains", "All channels", "No preview"],
    noValidation: ["Broken link", "Missing image", "Publish"],
    silentScheduleFail: ["09:00", "Failed", "No alert"],
    noRollback: ["Live error", "No restore", "No URL"],
    stalePublish: ["Draft v18", "Live v19", "Overwrite"]
  };
  return (
    <div className={`quality-example publish-workflow-bad-demo is-${mode}`}>
      <strong>{mode === "silentScheduleFail" ? "Scheduled publish" : mode === "stalePublish" ? "Publish old draft" : "Publish workflow"}</strong>
      <div className="publish-workflow-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row publish-workflow-controls">
        <button type="button" className={mode === "saveIsLive" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("saveIsLive")}>Save is live</button>
        <button type="button" className={mode === "wrongTarget" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongTarget")}>Wrong target</button>
        <button type="button" className={mode === "noValidation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noValidation")}>No validation</button>
        <button type="button" className={mode === "silentScheduleFail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silentScheduleFail")}>Silent fail</button>
        <button type="button" className={mode === "noRollback" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noRollback")}>No rollback</button>
        <button type="button" className={mode === "stalePublish" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stalePublish")}>Stale publish</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PublishWorkflowGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PublishWorkflowBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PublishWorkflowGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PublishWorkflowBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
