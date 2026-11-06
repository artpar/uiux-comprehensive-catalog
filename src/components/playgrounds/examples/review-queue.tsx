import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ReviewQueueStage = "scope" | "preview" | "claim" | "assign" | "sla" | "bulk" | "stale" | "skipped" | "escalated" | "done" | "empty" | "permission";

function ReviewQueueFrame({
  stage = "scope",
  selectedCount = 0,
  owner = "Unassigned",
  idSuffix = "demo"
}: {
  stage?: ReviewQueueStage;
  selectedCount?: number;
  owner?: string;
  idSuffix?: string;
}) {
  const title: Record<ReviewQueueStage, string> = {
    scope: "New triage: 18 items",
    preview: "Row reason and preview exposed",
    claim: "Ticket TCK-118 claimed",
    assign: "Assigned to Billing",
    sla: "SLA risk sorted first",
    bulk: "Bulk review preview",
    stale: "Row changed since load",
    skipped: "Skipped until tomorrow",
    escalated: "Escalated to policy review",
    done: "Reviewed and removed",
    empty: "No rows match active filters",
    permission: "Sensitive preview limited"
  };
  const queueCount = stage === "done" ? 17 : stage === "empty" ? 0 : 18;
  const rowStatus = stage === "stale" ? "Changed" : stage === "done" ? "Removed" : stage === "escalated" ? "Escalated" : stage === "skipped" ? "Snoozed" : "Needs review";
  const rows = [
    {
      id: "TCK-118",
      title: "Refund request mentions duplicate charge",
      reason: stage === "permission" ? "Billing queue, restricted details" : "SLA first response due in 18m",
      owner,
      status: rowStatus
    },
    {
      id: "COM-441",
      title: "Held comment likely spam",
      reason: "Auto-held by moderation settings",
      owner: "Maya",
      status: stage === "bulk" ? "Selected" : "Held"
    },
    {
      id: "PR-92",
      title: "Checkout API changes awaiting review",
      reason: "Team review re-requested after commits",
      owner: "Code owners",
      status: stage === "stale" ? "Stale" : "Open"
    }
  ];
  const statusText: Record<ReviewQueueStage, string> = {
    scope: "Shared scope, active filters, visible count, and sort order tell reviewers what workload they are processing.",
    preview: "Rows show why they are queued, enough preview context, and safe actions without forcing every item open.",
    claim: "Claiming the row prevents duplicate work and marks the current reviewer on the shared queue.",
    assign: "Assignment moves the row to the Billing queue and updates count and owner immediately.",
    sla: "SLA and age drive the default ordering so urgent work is not buried.",
    bulk: "Bulk action previews selected visible rows and flags stale or ineligible exceptions before applying.",
    stale: "The queue blocks stale decisions after a teammate or author changes the item.",
    skipped: "Skip removes the row from immediate work and records when it returns.",
    escalated: "Escalation changes queue state, owner, and next destination instead of hiding the item.",
    done: "After review, the row leaves the queue and focus moves to the next actionable item.",
    empty: "The empty state explains active filters and offers a reset without implying all work is done.",
    permission: "Restricted rows show safe metadata and route reviewers to authorized detail if needed."
  };

  return (
    <div className={`review-queue-frame is-${stage}`}>
      <section className="review-queue-list" aria-labelledby={`review-queue-title-${idSuffix}`}>
        <div className="review-queue-heading">
          <span>Review queue</span>
          <strong>{queueCount} visible</strong>
        </div>
        <h4 id={`review-queue-title-${idSuffix}`}>{title[stage]}</h4>
        <div className="review-queue-toolbar" aria-label="Queue filters">
          <span className="is-active">New triage</span>
          <span>SLA at risk</span>
          <span>Held</span>
          <span>Mine</span>
        </div>
        <div className="review-queue-rows">
          {stage === "empty" ? (
            <div className="review-queue-empty">
              <strong>No matching rows</strong>
              <span>Filters: Mine + Escalated. Reset filters or open shared triage.</span>
            </div>
          ) : rows.map((row, index) => (
            <div className={`${stage === "stale" && row.id === "PR-92" ? "is-stale" : ""} ${stage === "done" && index === 0 ? "is-done" : ""}`} key={row.id}>
              <span>{row.id}</span>
              <strong>{row.title}</strong>
              <em>{row.reason}</em>
              <small>{row.owner} · {row.status}</small>
            </div>
          ))}
        </div>
      </section>
      <aside className="review-queue-side" aria-label="Queue action summary">
        <strong>{stage === "bulk" ? `${selectedCount} selected` : "Next action"}</strong>
        <p>{statusText[stage]}</p>
        <dl>
          <div>
            <dt>Sort</dt>
            <dd>SLA due, oldest first</dd>
          </div>
          <div>
            <dt>After action</dt>
            <dd>{stage === "bulk" ? "Show exceptions" : stage === "done" ? "Focus next row" : "Preserve queue place"}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function ReviewQueueGoodUi() {
  return (
    <div className="quality-example review-queue-demo">
      <ReviewQueueFrame />
      <p className="demo-status">The queue shows scope, count, filters, row reason, owner, SLA, preview context, and actions so reviewers can triage many items safely.</p>
    </div>
  );
}

function ReviewQueueBadUi() {
  return (
    <div className="bad-ui-sample review-queue-bad-demo is-titleOnly">
      <strong>Review these</strong>
      <div className="review-queue-bad-grid">
        {["Refund thing", "Comment", "PR", "Old item", "Case", "Untitled"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken queue is only a list of titles, with no reason, count, owner, age, status, urgency, preview, or decision controls.</p>
    </div>
  );
}

function ReviewQueueGoodUx() {
  const [stage, setStage] = useState<ReviewQueueStage>("scope");
  const [selectedCount, setSelectedCount] = useState(0);
  const [owner, setOwner] = useState("Unassigned");
  const [message, setMessage] = useState("The shared queue starts with visible scope, count, filters, SLA sort, and row reasons.");

  function choose(nextStage: ReviewQueueStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example review-queue-demo">
      <ReviewQueueFrame stage={stage} selectedCount={selectedCount} owner={owner} idSuffix="good-ux" />
      <div className="demo-row review-queue-controls" aria-label="Review queue exercise controls">
        <button type="button" className={stage === "scope" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSelectedCount(0);
          setOwner("Unassigned");
          choose("scope", "Scope shows New triage with 18 visible rows, active filters, and SLA sorting before work begins.");
        }}>Scope</button>
        <button type="button" className={stage === "preview" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("preview", "Preview exposes queue reason, safe context, status, and available actions without opening every item.")}>Preview</button>
        <button type="button" className={stage === "claim" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOwner("You");
          choose("claim", "Claim marks TCK-118 as yours so another reviewer does not unknowingly work the same row.");
        }}>Claim</button>
        <button type="button" className={stage === "assign" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOwner("Billing");
          choose("assign", "Assign moves the row into the Billing queue and updates owner and count immediately.");
        }}>Assign</button>
        <button type="button" className={stage === "sla" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sla", "SLA risk and age bring urgent rows to the top instead of relying on title order.")}>SLA sort</button>
        <button type="button" className={stage === "bulk" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSelectedCount(5);
          choose("bulk", "Bulk preview names 5 visible rows and separates stale or ineligible exceptions before action.");
        }}>Bulk preview</button>
        <button type="button" className={stage === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale row detection blocks acting on PR-92 after new commits changed the review request.")}>Stale row</button>
        <button type="button" className={stage === "skipped" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("skipped", "Skip removes a row from immediate work and records when it returns to the queue.")}>Skip</button>
        <button type="button" className={stage === "escalated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("escalated", "Escalation changes owner and queue destination while keeping the row traceable.")}>Escalate</button>
        <button type="button" className={stage === "done" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("done", "After review, the row leaves the queue and focus moves to the next actionable row.")}>Reviewed</button>
        <button type="button" className={stage === "empty" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("empty", "Empty queue explains active filters and offers reset instead of claiming all work is done.")}>Empty</button>
        <button type="button" className={stage === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Permission-limited rows show safe metadata without exposing sensitive content in the shared queue.")}>Permission</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ReviewQueueBadUx() {
  type Mode = "titleOnly" | "hiddenBulk" | "doubleWork" | "staleAction" | "noNext" | "unsafePreview";
  const [mode, setMode] = useState<Mode>("titleOnly");
  const copy: Record<Mode, string> = {
    titleOnly: "Reviewers cannot tell why rows are queued, who owns them, how old they are, or what action is safe.",
    hiddenBulk: "Bulk approve includes hidden filtered rows without count, preview, stale checks, or exception handling.",
    doubleWork: "Two reviewers act on the same unclaimed item and the second decision overwrites the first.",
    staleAction: "A pull request row stays actionable after new commits changed the requested review.",
    noNext: "After each decision the queue jumps back to the top and loses the reviewer place.",
    unsafePreview: "Sensitive customer details are exposed in the shared queue even though reviewers only need metadata."
  };
  const labels: Record<Mode, string[]> = {
    titleOnly: ["Title", "Title", "Title"],
    hiddenBulk: ["48 selected", "Hidden rows", "Approve all"],
    doubleWork: ["Maya open", "Omar open", "Same row"],
    staleAction: ["Old PR", "New commits", "Approve"],
    noNext: ["Done", "Top reset", "Lost place"],
    unsafePreview: ["Card number", "Full email", "Private note"]
  };
  return (
    <div className={`quality-example review-queue-bad-demo is-${mode}`}>
      <strong>{mode === "hiddenBulk" ? "Bulk review" : mode === "unsafePreview" ? "Shared queue" : "Review queue"}</strong>
      <div className="review-queue-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row review-queue-controls">
        <button type="button" className={mode === "titleOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("titleOnly")}>Title only</button>
        <button type="button" className={mode === "hiddenBulk" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenBulk")}>Hidden bulk</button>
        <button type="button" className={mode === "doubleWork" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("doubleWork")}>Double work</button>
        <button type="button" className={mode === "staleAction" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleAction")}>Stale action</button>
        <button type="button" className={mode === "noNext" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noNext")}>No next</button>
        <button type="button" className={mode === "unsafePreview" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unsafePreview")}>Unsafe preview</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReviewQueueGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReviewQueueBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReviewQueueGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReviewQueueBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
