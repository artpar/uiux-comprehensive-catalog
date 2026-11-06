import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ChangeReviewMode = "diff" | "suggestion" | "pending" | "submitted" | "accepted" | "rejected" | "batch" | "stale" | "viewed" | "permission" | "mobile";

const changeReviewCopy: Record<ChangeReviewMode, {
  title: string;
  status: string;
  scope: string;
  detail: string;
  note: string;
  fileState: string;
}> = {
  diff: {
    title: "Review checkout validation copy",
    status: "2 of 6 changes reviewed",
    scope: "One diff hunk",
    detail: "Original and proposed text are visible with the exact file, line range, author, and current review progress.",
    note: "No decision is applied until the reviewer accepts, rejects, comments, or submits a review.",
    fileState: "Unviewed"
  },
  suggestion: {
    title: "Suggested replacement",
    status: "Suggestion ready",
    scope: "Lines 42-44",
    detail: "A reviewer suggestion can be applied as a patch, rejected with rationale, or left unresolved for the author.",
    note: "Apply suggestion names the patch scope before creating a commit.",
    fileState: "Unviewed"
  },
  pending: {
    title: "Pending review comment",
    status: "Private draft",
    scope: "Line 44 comment",
    detail: "The comment is saved as pending feedback and is only visible to the reviewer until Submit review.",
    note: "Draft and submitted comment states are visually distinct.",
    fileState: "Unviewed"
  },
  submitted: {
    title: "Submitted review",
    status: "Request changes",
    scope: "Whole review",
    detail: "The summary comment and pending line comments are now visible to collaborators as a request-changes review.",
    note: "Submitted feedback is no longer a private draft.",
    fileState: "Needs author"
  },
  accepted: {
    title: "Accepted suggestion",
    status: "Applied",
    scope: "One suggestion",
    detail: "The suggested wording was accepted, the thread resolved, and the review record names who applied it.",
    note: "Accepted changes keep the decision trace.",
    fileState: "Viewed"
  },
  rejected: {
    title: "Rejected suggestion",
    status: "Rejected with reason",
    scope: "One suggestion",
    detail: "The risky deletion was rejected and the rationale remains attached to the unresolved thread.",
    note: "Reject does not erase the reviewer context.",
    fileState: "Needs author"
  },
  batch: {
    title: "Batch suggestions",
    status: "3 selected, 1 stale",
    scope: "Visible suggestions only",
    detail: "The batch preview lists included suggestions, excluded hidden changes, and the stale item before applying.",
    note: "Broad actions require scope preview and exceptions.",
    fileState: "Mixed"
  },
  stale: {
    title: "Outdated hunk",
    status: "Changed since load",
    scope: "Lines 42-44",
    detail: "New commits changed this line, so Apply is blocked until the reviewer refreshes or re-reviews.",
    note: "Stale changes cannot be applied silently.",
    fileState: "Outdated"
  },
  viewed: {
    title: "File marked viewed",
    status: "Viewed",
    scope: "checkout-copy.ts",
    detail: "Mark viewed collapses the reviewed file and updates progress without approving the change set.",
    note: "Viewed tracks progress; it is not approval.",
    fileState: "Viewed"
  },
  permission: {
    title: "Read-only reviewer",
    status: "Apply blocked",
    scope: "Suggestion visible",
    detail: "The reviewer can comment and inspect the diff but cannot apply or accept changes without write access.",
    note: "Unavailable decision controls explain the permission layer.",
    fileState: "Read-only"
  },
  mobile: {
    title: "Condensed change navigation",
    status: "Next unresolved",
    scope: "Mobile hunk",
    detail: "The mobile layout keeps file name, line range, original, proposed, comment state, and decision controls in order.",
    note: "Small screens preserve scope and consequence copy.",
    fileState: "Unviewed"
  }
};

function ChangeReviewFrame({
  mode = "diff",
  idSuffix = "demo"
}: {
  mode?: ChangeReviewMode;
  idSuffix?: string;
}) {
  const copy = changeReviewCopy[mode];
  const titleId = `change-review-title-${idSuffix}`;
  const isBlocked = mode === "stale" || mode === "permission";
  const isDecision = mode === "accepted" || mode === "rejected" || mode === "submitted";
  return (
    <div className={`change-review-frame is-${mode}`}>
      <section className="change-review-diff" aria-labelledby={titleId}>
        <div className="change-review-head">
          <span>checkout-copy.ts</span>
          <strong>{copy.status}</strong>
        </div>
        <h4 id={titleId}>{copy.title}</h4>
        <div className="change-review-hunk" aria-label="Original and proposed change">
          <div className="change-review-line is-original">
            <span>-</span>
            <code>Show final price after payment details are complete.</code>
          </div>
          <div className="change-review-line is-proposed">
            <span>+</span>
            <code>Show estimated total before payment and confirm final price at review.</code>
          </div>
          <div className="change-review-line is-context">
            <span> </span>
            <code>Validation message appears beside the checkout total.</code>
          </div>
        </div>
        <div className="change-review-file-row">
          <span>File progress</span>
          <b>{copy.fileState}</b>
          <em>{copy.scope}</em>
        </div>
      </section>
      <aside className="change-review-panel" aria-label="Change review decision">
        <div className="change-review-meta">
          <span>Reviewer</span>
          <strong>Maya Chen</strong>
          <em>Lines 42-44 - suggested by Omar</em>
        </div>
        <p>{copy.detail}</p>
        <div className={isBlocked || mode === "batch" ? "change-review-note is-warning" : "change-review-note"}>
          {copy.note}
        </div>
        <div className="change-review-actions">
          <button type="button" className="demo-button small" disabled={isBlocked}>Accept</button>
          <button type="button" className="demo-button small danger" disabled={mode === "permission"}>Reject</button>
          <button type="button" className="demo-button small" disabled={isBlocked}>Apply suggestion</button>
          <button type="button" className="demo-button small primary">{isDecision ? "Review submitted" : "Submit review"}</button>
        </div>
      </aside>
    </div>
  );
}

function ChangeReviewGoodUi() {
  return (
    <div className="quality-example change-review-demo">
      <ChangeReviewFrame mode="suggestion" />
      <p className="demo-status">The proposed change is bound to original text, proposed text, line scope, author context, review progress, and explicit decision controls.</p>
    </div>
  );
}

function ChangeReviewBadUi() {
  return (
    <div className="bad-ui-sample change-review-bad-demo is-noBase">
      <strong>Changes</strong>
      <div className="change-review-bad-grid">
        {["Looks good", "Accept all", "Reject", "Done"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken surface hides original content, proposed content, line scope, pending feedback, and whether Accept all includes hidden changes.</p>
    </div>
  );
}

function ChangeReviewGoodUx() {
  const [mode, setMode] = useState<ChangeReviewMode>("diff");
  const [message, setMessage] = useState("The reviewer starts with one unresolved diff hunk and visible base-versus-proposed content.");
  function choose(nextMode: ChangeReviewMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example change-review-demo">
      <ChangeReviewFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row change-review-controls" aria-label="Change review exercise controls">
        <button type="button" className={mode === "diff" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("diff", "The reviewer starts with one unresolved diff hunk and visible base-versus-proposed content.")}>Diff</button>
        <button type="button" className={mode === "suggestion" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("suggestion", "Suggested replacement can be applied as a scoped patch or rejected with rationale.")}>Suggestion</button>
        <button type="button" className={mode === "pending" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pending", "Pending review comment is private until the review is submitted.")}>Pending</button>
        <button type="button" className={mode === "submitted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("submitted", "Submitted review makes the summary and line comments visible to collaborators.")}>Submitted</button>
        <button type="button" className={mode === "accepted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("accepted", "Accepted suggestion resolves the thread and keeps a trace of who applied it.")}>Accepted</button>
        <button type="button" className={mode === "rejected" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rejected", "Rejected suggestion keeps rationale attached instead of deleting context.")}>Rejected</button>
        <button type="button" className={mode === "batch" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("batch", "Batch preview names visible scope, hidden exclusions, and stale suggestions before apply.")}>Batch</button>
        <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale hunk blocks Apply until the reviewer refreshes or re-reviews.")}>Stale</button>
        <button type="button" className={mode === "viewed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("viewed", "Mark viewed updates progress without approving the change set.")}>Viewed</button>
        <button type="button" className={mode === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Permission-limited reviewers can comment but cannot accept or apply changes.")}>Permission</button>
        <button type="button" className={mode === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile layout preserves file, line range, original, proposed, comment state, and decision controls.")}>Mobile</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ChangeReviewBadUx() {
  type Mode = "broadScope" | "draftConfusion" | "staleApply" | "noBase" | "commentOnly" | "hiddenPermission";
  const [mode, setMode] = useState<Mode>("broadScope");
  const copy: Record<Mode, string> = {
    broadScope: "Accept all appears beside one visible edit but applies hidden changes across the document.",
    draftConfusion: "Pending review comments look submitted, so the author never sees the feedback.",
    staleApply: "Apply suggestion still runs after new commits changed the same line.",
    noBase: "The reviewer sees proposed text without original content or line context.",
    commentOnly: "The surface supports discussion but has no accept, reject, apply, viewed, or submit-review state.",
    hiddenPermission: "A read-only user sees active Apply and Accept controls that fail after click."
  };
  const labels: Record<Mode, string[]> = {
    broadScope: ["Accept all", "1 visible", "9 hidden"],
    draftConfusion: ["Looks posted", "Still pending", "Author blind"],
    staleApply: ["Old line", "New commit", "Patch anyway"],
    noBase: ["New text", "No original", "No scope"],
    commentOnly: ["Discuss", "Maybe fix", "No decision"],
    hiddenPermission: ["Apply", "No access", "Late error"]
  };
  return (
    <div className={`quality-example change-review-bad-demo is-${mode}`}>
      <strong>{mode === "draftConfusion" ? "Draft feedback confusion" : mode === "hiddenPermission" ? "Hidden permission" : "Broken change review"}</strong>
      <div className="change-review-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row change-review-controls">
        <button type="button" className={mode === "broadScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("broadScope")}>Broad scope</button>
        <button type="button" className={mode === "draftConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("draftConfusion")}>Draft confusion</button>
        <button type="button" className={mode === "staleApply" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleApply")}>Stale apply</button>
        <button type="button" className={mode === "noBase" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noBase")}>No base</button>
        <button type="button" className={mode === "commentOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("commentOnly")}>Comment only</button>
        <button type="button" className={mode === "hiddenPermission" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenPermission")}>Hidden permission</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChangeReviewGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChangeReviewBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChangeReviewGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChangeReviewBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
