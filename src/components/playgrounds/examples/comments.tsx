import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CommentsMode = "open" | "reply" | "resolved" | "reopened" | "assigned" | "edited" | "hidden" | "deleted" | "directLink" | "permission" | "draft";

function CommentsFrame({
  mode = "open",
  idSuffix = "demo"
}: {
  mode?: CommentsMode;
  idSuffix?: string;
}) {
  const isResolved = mode === "resolved";
  const isHidden = mode === "hidden";
  const isDeleted = mode === "deleted";
  const isAssigned = mode === "assigned";
  const isEdited = mode === "edited";
  const isDirect = mode === "directLink";
  const isPermission = mode === "permission";
  const isDraft = mode === "draft";
  const titleId = `comments-title-${idSuffix}`;
  const status = isDeleted
    ? "Deleted with timeline event"
    : isHidden
      ? "Hidden: off-topic"
      : isResolved
        ? "Resolved"
        : isAssigned
          ? "Assigned to Dana"
          : "Open";

  return (
    <div className={`comments-frame comments-surface is-${mode}`}>
      <section className="comments-object" aria-labelledby={titleId}>
        <div className="comments-object-head">
          <span>Shipment exception</span>
          <strong>Line 18</strong>
        </div>
        <h4 id={titleId}>Carrier surcharge note</h4>
        <p>The carrier added a manual fuel surcharge after pickup. <mark>The invoice total does not match the approved quote.</mark> Confirm whether finance should dispute the charge before release.</p>
        <div className="comments-anchor">
          <span>{isDirect ? "Direct link focused this selection" : "Comment anchor"}</span>
          <b>Invoice total does not match approved quote</b>
        </div>
      </section>
      <section className="comments-panel" aria-label="Comments on selected text">
        <div className="comments-toolbar">
          <strong>Comments</strong>
          <span>{status}</span>
          <span>{isPermission ? "Read and reply only" : "Owner can resolve"}</span>
        </div>
        <article className={`comment-card ${isResolved ? "is-resolved" : ""} ${isHidden ? "is-hidden" : ""} ${isDeleted ? "is-deleted" : ""} ${isDirect ? "is-direct" : ""}`} aria-labelledby={`comment-${idSuffix}-title`}>
          <div className="comment-meta">
            <span className="comment-avatar" aria-hidden="true">M</span>
            <div>
              <b id={`comment-${idSuffix}-title`}>Maya Chen</b>
              <time>Today 10:42</time>
            </div>
            <em>{status}</em>
          </div>
          {isDeleted ? (
            <p className="comment-body">A comment was deleted by Priya. Timeline event remains visible to readers.</p>
          ) : isHidden ? (
            <p className="comment-body">This comment is hidden because it was off-topic. Readers can show it if they have access.</p>
          ) : (
            <p className="comment-body">{isEdited ? "Edited: Please confirm whether finance should dispute the surcharge before Friday." : "Can finance confirm whether this surcharge should be disputed before release?"}</p>
          )}
          <div className="comment-facts">
            <span>{isEdited ? "Edited at 10:58" : "Original anchor saved"}</span>
            <span>{isAssigned ? "Action item: Dana" : "2 people notified"}</span>
            <span>{isResolved ? "Reopen available" : "Resolve available"}</span>
          </div>
          <div className="comment-actions">
            <button type="button" className="demo-button small">Reply</button>
            <button type="button" className="demo-button small">{isResolved ? "Reopen" : "Resolve"}</button>
            <button type="button" className="demo-button small">{isPermission ? "Request edit access" : "Edit"}</button>
            <button type="button" className="demo-button small danger">{isDeleted ? "Deletion log" : "Delete"}</button>
          </div>
          {mode === "reply" || mode === "reopened" ? (
            <div className="comment-reply">
              <span>Dana replied 2 minutes ago</span>
              <p>Finance has the quote and will confirm by 15:00.</p>
            </div>
          ) : null}
        </article>
        <form className="comment-composer" aria-label="Add comment">
          <label htmlFor={`comment-draft-${idSuffix}`}>{isDraft ? "Recovered draft" : "Add a comment on this selection"}</label>
          <textarea id={`comment-draft-${idSuffix}`} value={isDraft ? "Draft restored after reconnect: ask finance to confirm dispute path." : ""} readOnly placeholder="Write a comment" rows={3} />
          <div>
            <button type="button" className="demo-button small primary">Comment</button>
            <button type="button" className="demo-button small">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function CommentsGoodUi() {
  return (
    <div className="quality-example comments-demo">
      <CommentsFrame />
      <p className="demo-status">The comment stays anchored to a selected object, shows author and time metadata, and exposes reply, resolve, edit, delete, and composer controls.</p>
    </div>
  );
}

function CommentsBadUi() {
  return (
    <div className="bad-ui-sample comments-bad-demo is-looseNotes">
      <strong>Internal notes</strong>
      <textarea readOnly value={"Finance?\nMaya: maybe dispute\nDana: ok"} />
      <div className="comments-bad-actions">
        <span>Save</span>
        <span>Delete</span>
        <span>No author</span>
      </div>
      <p className="demo-status">The broken surface is a shared notes field: no anchor, authorship, timestamp, reply, resolve, or permission-aware action state.</p>
    </div>
  );
}

function CommentsGoodUx() {
  const [mode, setMode] = useState<CommentsMode>("open");
  const [message, setMessage] = useState("The open comment is tied to the highlighted invoice text and has item-scoped actions.");
  function choose(nextMode: CommentsMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example comments-demo">
      <CommentsFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row comments-controls" aria-label="Comments exercise controls">
        <button type="button" className={mode === "open" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("open", "The open comment stays anchored to the selected text with author, timestamp, and actions.")}>Open</button>
        <button type="button" className={mode === "reply" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reply", "Reply preserves the original comment, appends a response, and returns focus near the conversation.")}>Reply</button>
        <button type="button" className={mode === "resolved" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resolved", "Resolve collapses the work state but leaves the conversation findable and reopenable.")}>Resolve</button>
        <button type="button" className={mode === "reopened" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reopened", "Reopen restores the conversation without losing replies or the anchor.")}>Reopen</button>
        <button type="button" className={mode === "assigned" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("assigned", "Assignment names the responsible person and keeps the comment as the action item source.")}>Assign</button>
        <button type="button" className={mode === "edited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("edited", "Edited state names that content changed and keeps the prior comment context recoverable.")}>Edit</button>
        <button type="button" className={mode === "hidden" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("hidden", "Moderation hides the body with a reason instead of removing all evidence.")}>Hide</button>
        <button type="button" className={mode === "deleted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("deleted", "Deletion leaves a visible timeline event and makes the destructive outcome explicit.")}>Delete</button>
        <button type="button" className={mode === "directLink" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("directLink", "A notification or copied link focuses the exact comment and its selected text.")}>Direct link</button>
        <button type="button" className={mode === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Permission-limited users can read and reply but cannot edit or delete others' comments.")}>Permissions</button>
        <button type="button" className={mode === "draft" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("draft", "A recovered draft survives reconnect before the user sends or discards it.")}>Recover draft</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CommentsBadUx() {
  type Mode = "looseNotes" | "lostAnchor" | "hoverOnly" | "silentDelete" | "noDeepLink" | "draftLoss";
  const [mode, setMode] = useState<Mode>("looseNotes");
  const copy: Record<Mode, string> = {
    looseNotes: "A shared notes field overwrites authors and makes replies impossible to separate.",
    lostAnchor: "The comment says this number is wrong but no longer shows which number or object it refers to.",
    hoverOnly: "Edit, resolve, and delete appear only on hover, so keyboard and touch users cannot find them.",
    silentDelete: "Delete removes the comment immediately with no warning, reason, or timeline evidence.",
    noDeepLink: "The notification opens the record top and forces users to search for the comment.",
    draftLoss: "A network retry clears the typed comment and gives no recovery path."
  };
  const labels: Record<Mode, string[]> = {
    looseNotes: ["Finance?", "Maybe dispute", "No author"],
    lostAnchor: ["This is wrong", "Somewhere in file", "No selection"],
    hoverOnly: ["Reply hidden", "Resolve hidden", "Delete hidden"],
    silentDelete: ["Deleted", "No reason", "No event"],
    noDeepLink: ["New comment", "Open record", "Find it yourself"],
    draftLoss: ["Saving failed", "Draft cleared", "Start again"]
  };
  return (
    <div className={`quality-example comments-bad-demo is-${mode}`}>
      <strong>{mode === "lostAnchor" ? "Detached comment" : mode === "noDeepLink" ? "Comment notification" : "Comment area"}</strong>
      <div className="comments-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row comments-controls">
        <button type="button" className={mode === "looseNotes" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("looseNotes")}>Loose notes</button>
        <button type="button" className={mode === "lostAnchor" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostAnchor")}>Lost anchor</button>
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "silentDelete" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silentDelete")}>Silent delete</button>
        <button type="button" className={mode === "noDeepLink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noDeepLink")}>No deep link</button>
        <button type="button" className={mode === "draftLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("draftLoss")}>Draft loss</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CommentsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CommentsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CommentsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CommentsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
