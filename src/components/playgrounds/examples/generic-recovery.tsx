import { useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

function UndoUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (patternId === "fake-undo") return good ? <FakeUndoGoodUi /> : <FakeUndoBadUi />;

  if (patternId === "unsaved-changes-prompt") {
    if (!good) {
      return (
        <div className="bad-ui-sample unsaved-prompt-static-preview">
          <div className="unsaved-prompt-card bad">
            <strong>Are you sure?</strong>
            <span>OK closes the editor, but the prompt does not say whether changes to {meta.subject} are saved or discarded.</span>
            <div className="unsaved-prompt-actions">
              <button type="button" className="demo-button small danger">OK</button>
              <button type="button" className="demo-button small">Cancel</button>
            </div>
          </div>
          <p className="demo-status">The prompt hides dirty fields, save state, and the safe keep-editing path.</p>
        </div>
      );
    }

    return (
      <div className="quality-example unsaved-prompt-static-preview">
        <div className="unsaved-prompt-card">
          <strong>Save changes to {meta.subject}?</strong>
          <span>{meta.options[0]} and {meta.options[1]} changed. Save before closing, review the field changes, discard them, or keep editing.</span>
          <div className="unsaved-prompt-actions">
            <button type="button" className="demo-button small primary">Keep editing</button>
            <button type="button" className="demo-button small">Review changes</button>
            <button type="button" className="demo-button small">Save changes</button>
            <button type="button" className="demo-button small danger">Discard changes</button>
          </div>
        </div>
        <p className="demo-status">The prompt appears only for a dirty editor and separates save, discard, review, and stay decisions.</p>
      </div>
    );
  }

  if (patternId === "exit-warning") {
    if (!good) {
      return (
        <div className="bad-ui-sample exit-warning-static-preview">
          <div className="exit-warning-card bad">
            <strong>Leave page?</strong>
            <span>Are you sure?</span>
            <div className="exit-warning-actions">
              <button type="button" className="demo-button small danger">OK</button>
              <button type="button" className="demo-button small">Cancel</button>
            </div>
          </div>
          <p className="demo-status">The warning does not name the changed work, destination, save state, or recovery choice.</p>
        </div>
      );
    }

    return (
      <div className="quality-example exit-warning-static-preview">
        <div className="exit-warning-card">
          <strong>Unsaved grant application</strong>
          <span>{meta.options[0]} and {meta.options[1]} are not saved. Leaving for {meta.options[2]} will discard the latest changes.</span>
          <div className="exit-warning-actions">
            <button type="button" className="demo-button small primary">Stay editing</button>
            <button type="button" className="demo-button small">Save and leave</button>
            <button type="button" className="demo-button small danger">Discard and leave</button>
          </div>
        </div>
        <p className="demo-status">The guard appears only after an attempted departure and separates stay, save, and discard outcomes.</p>
      </div>
    );
  }

  if (patternId === "session-timeout-warning") {
    if (!good) {
      return (
        <div className="bad-ui-sample session-timeout-static-preview">
          <div className="session-timeout-warning bad">
            <strong>Session expiring soon</strong>
            <span>No countdown, work status, server-confirmed extension, or reauthentication return path is shown.</span>
            <div className="session-timeout-actions">
              <button type="button" className="demo-button small danger">OK</button>
              <button type="button" className="demo-button small">Retry</button>
            </div>
          </div>
          <p className="demo-status">The notice is vague and cannot tell users whether {meta.options[0]} survives expiry.</p>
        </div>
      );
    }

    return (
      <div className="quality-example session-timeout-static-preview">
        <div className="session-timeout-warning">
          <strong>Your session will end in 2 minutes</strong>
          <span>{meta.options[0]} is not yet saved. Stay signed in, save the draft, or sign out safely with {meta.options[3]}.</span>
          <div className="session-timeout-actions">
            <button type="button" className="demo-button small primary">Stay signed in</button>
            <button type="button" className="demo-button small">Save draft</button>
            <button type="button" className="demo-button small danger">Sign out</button>
          </div>
        </div>
        <p className="demo-status">The warning names the timer, current work state, allowed actions, and safe recovery reference.</p>
      </div>
    );
  }

  if (patternId === "autosave-recovery") {
    if (!good) {
      return (
        <div className="bad-ui-sample autosave-recovery-static-preview">
          <div className="autosave-recovery-card bad">
            <strong>Saved</strong>
            <span>The newest answer failed to save, but the interface still shows an old success label and no local-copy action.</span>
            <div className="autosave-recovery-actions">
              <button type="button" className="demo-button small danger">Submit anyway</button>
              <button type="button" className="demo-button small">Reload</button>
            </div>
          </div>
          <p className="demo-status">The failed local value is hidden, so users cannot retry, copy, compare, or restore safely.</p>
        </div>
      );
    }

    return (
      <div className="quality-example autosave-recovery-static-preview">
        <div className="autosave-recovery-card">
          <strong>{meta.options[0]} failed to autosave</strong>
          <span>Last saved on server at 10:37. Latest local copy from 10:42 is still available for {meta.options[3]}.</span>
          <div className="autosave-recovery-actions">
            <button type="button" className="demo-button small primary">Retry save</button>
            <button type="button" className="demo-button small">Copy answer</button>
            <button type="button" className="demo-button small">Compare versions</button>
          </div>
        </div>
        <p className="demo-status">The recovery surface names the failed section, timestamps, storage location, and safe next actions.</p>
      </div>
    );
  }

  if (patternId === "conflict-resolution") {
    if (!good) {
      return (
        <div className="bad-ui-sample conflict-resolution-static-preview">
          <div className="conflict-card bad">
            <div className="conflict-topline">
              <div>
                <strong>3 conflicts resolved</strong>
                <span>Recommended values will be applied to the field report.</span>
              </div>
              <span className="conflict-chip bad">Accept all</span>
            </div>
            <div className="conflict-version-stack">
              <div className="conflict-value muted">
                <span>Resolution detail</span>
                <strong>Not shown before commit</strong>
                <small>No per-field decision, source labels, skipped items, or discarded-value summary is visible.</small>
              </div>
            </div>
            <div className="conflict-actions">
              <button type="button" className="demo-button small danger">Commit all</button>
              <button type="button" className="demo-button small">Later</button>
            </div>
          </div>
          <p className="demo-status">The broken resolver commits a bulk decision before users inspect each conflict or final result.</p>
        </div>
      );
    }

    return (
      <div className="quality-example conflict-resolution-static-preview">
        <div className="conflict-card" aria-describedby="conflict-resolution-good-helper">
          <div className="conflict-topline">
            <div>
              <strong>Resolve field report conflicts</strong>
              <span>2 unresolved of 3. Review each conflicting unit before committing {meta.options[4]}.</span>
            </div>
            <span className="conflict-chip review">Review 2 remaining</span>
          </div>
          <div className="resolution-stepper" aria-label="Conflict resolution progress">
            <span className="is-done">Supervisor comment - merged</span>
            <span className="is-current">Emergency contact - reviewing</span>
            <span>Photo attachment - manual</span>
          </div>
          <div className="conflict-version-grid" aria-label="Current conflict values">
            <div className="conflict-value mine">
              <span>Your offline value - 11:06</span>
              <strong>Call Jordan if pressure rises again.</strong>
              <small>Stored on this device.</small>
            </div>
            <div className="conflict-value theirs">
              <span>Server value by Mina - 11:07</span>
              <strong>Call Priya for tomorrow's inspection.</strong>
              <small>Current server report.</small>
            </div>
          </div>
          <div className="conflict-actions">
            <button type="button" className="demo-button small primary">Merge both</button>
            <button type="button" className="demo-button small">Keep local</button>
            <button type="button" className="demo-button small">Keep server</button>
            <button type="button" className="demo-button small">Save copy</button>
          </div>
        </div>
        <p className="demo-status" id="conflict-resolution-good-helper">The resolver shows progress, current competing values, explicit decisions, and no final commit until review is complete.</p>
      </div>
    );
  }

  if (patternId === "permission-recovery") {
    if (!good) {
      return (
        <div className="permission-recovery-bad-ui" aria-label="Broken permission recovery">
          <div className="permission-card bad">
            <div className="permission-topline">
              <div>
                <strong>Request sent</strong>
                <span>You should have access now.</span>
              </div>
              <span className="permission-chip bad">Unverified</span>
            </div>
            <div className="permission-row muted">
              <span>Request status</span>
              <strong>No owner decision</strong>
              <small>No requested role, reason, owner, request ID, pending state, or return path is shown.</small>
            </div>
            <div className="permission-actions">
              <button type="button" className="demo-button small primary">Retry report</button>
              <button type="button" className="demo-button small">Send again</button>
            </div>
          </div>
          <p className="demo-status">The broken recovery flow treats request submission as approval and sends users into retry or duplicate-request loops.</p>
        </div>
      );
    }

    return (
      <div className="permission-recovery-demo-shell">
        <div className="permission-card" aria-describedby="permission-recovery-good-helper">
          <div className="permission-topline">
            <div>
              <strong>Request {meta.options[0]} access</strong>
              <span>{meta.subject} is blocked for {meta.options[3]}. Recovery keeps the report return path attached.</span>
            </div>
            <span className="permission-chip pending">Request path</span>
          </div>
          <div className="permission-grid">
            <div className="permission-row">
              <span>Requested role</span>
              <strong>{meta.options[0]}</strong>
              <small>Needed to view forecast worksheets.</small>
            </div>
            <div className="permission-row">
              <span>Owner route</span>
              <strong>{meta.options[2]}</strong>
              <small>Receives request reason and target report.</small>
            </div>
          </div>
          <div className="permission-recovery-timeline" aria-label="Permission recovery timeline">
            <span className="is-done">Denied</span>
            <span className="is-current">Reason</span>
            <span>Owner review</span>
            <span>Resume</span>
          </div>
          <div className="permission-request-box">
            <strong>Reason to owner</strong>
            <span>Need Q2 renewal forecast before Friday review. Request ID will be {meta.options[1]}.</span>
          </div>
          <div className="permission-actions">
            <button type="button" className="demo-button small primary">Send request</button>
            <button type="button" className="demo-button small">Switch account</button>
            <button type="button" className="demo-button small">Open allowed dashboard</button>
          </div>
        </div>
        <p className="demo-status" id="permission-recovery-good-helper">The recovery workflow captures role, reason, owner route, pending status, and the original report return path before access is retried.</p>
      </div>
    );
  }

  if (patternId === "merge-conflict-resolver") {
    if (!good) {
      return (
        <div className="bad-ui-sample merge-conflict-static-preview">
          <div className="conflict-card bad">
            <div className="conflict-topline">
              <div>
                <strong>Resolve conflicts</strong>
                <span>Ours and Theirs are shown without branch names, file path, hunk count, or validation status.</span>
              </div>
              <span className="conflict-chip bad">Unsafe</span>
            </div>
            <div className="merge-code-panel bad" aria-label="Unclear merge conflict">
              <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; ours</code>
              <code>return calculateDiscount(total);</code>
              <code>=======</code>
              <code>return calculateDiscount(total, region);</code>
              <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; theirs</code>
            </div>
            <div className="conflict-actions">
              <button type="button" className="demo-button small danger">Accept all incoming</button>
              <button type="button" className="demo-button small">Commit</button>
            </div>
          </div>
          <p className="demo-status">The broken resolver hides branch meaning and allows a broad action before users inspect the affected file or hunk.</p>
        </div>
      );
    }

    return (
      <div className="quality-example merge-conflict-static-preview">
        <div className="conflict-card" aria-describedby="merge-conflict-good-helper">
          <div className="conflict-topline">
            <div>
              <strong>{meta.subject}: resolve {meta.options[0]}</strong>
              <span>Target main vs source feature/billing. Hunk 1 of 2 must validate before {meta.options[4]}.</span>
            </div>
            <span className="conflict-chip review">2 hunks open</span>
          </div>
          <div className="merge-file-tabs" aria-label="Conflict files">
            <span className="is-current">{meta.options[0]}</span>
            <span>package-lock.json - manual</span>
          </div>
          <div className="merge-code-panel" aria-label="Compared code hunk">
            <code className="merge-code-line target">main: return calculateDiscount(total);</code>
            <code className="merge-code-line source">feature/billing: return calculateDiscount(total, region);</code>
            <code className="merge-code-line resolved">resolved: return calculateDiscount(total, region) ?? 0;</code>
          </div>
          <div className="conflict-actions">
            <button type="button" className="demo-button small">{meta.options[1]}</button>
            <button type="button" className="demo-button small">{meta.options[2]}</button>
            <button type="button" className="demo-button small primary">{meta.options[3]}</button>
          </div>
        </div>
        <p className="demo-status" id="merge-conflict-good-helper">The resolver names branches, file path, current hunk, code choices, validation status, and commit boundary.</p>
      </div>
    );
  }

  if (patternId === "graceful-degradation") {
    if (!good) {
      return (
        <div className="bad-ui-sample graceful-degradation-static-preview">
          <div className="degradation-card bad">
            <strong>Calendar loading</strong>
            <span></span>
            <button type="button" className="demo-button small" disabled>Continue</button>
          </div>
          <p className="demo-status">The enhanced widget failed and the page hides date fields, location choices, and the reason Continue is blocked.</p>
        </div>
      );
    }

    return (
      <div className="quality-example graceful-degradation-static-preview">
        <div className="degradation-card is-calendar">
          <strong>Calendar unavailable</strong>
          <span>{meta.options[1]} and {meta.options[2]} remain available for {meta.options[3]}.</span>
          <div className="degradation-mini-form">
            <label>
              <span>Date</span>
              <input value="2026-07-14" readOnly />
            </label>
            <label>
              <span>Location</span>
              <select value="North clinic" disabled>
                <option>North clinic</option>
              </select>
            </label>
          </div>
          <button type="button" className="demo-button small primary">Continue with date fields</button>
        </div>
        <p className="demo-status">The same page names the failed enhancement and keeps the core booking path usable.</p>
      </div>
    );
  }

  if (patternId === "fallback-path") {
    if (!good) {
      return (
        <div className="bad-ui-sample fallback-path-static-preview">
          <div className="fallback-path-card bad">
            <strong>No matches</strong>
            <span>Try the search again.</span>
            <button type="button">Search again</button>
          </div>
          <p className="demo-status">The primary lookup fails but no manual, assisted, or reference-preserving route is visible.</p>
        </div>
      );
    }

    return (
      <div className="quality-example fallback-path-static-preview">
        <div className="fallback-path-card">
          <strong>We could not find the address</strong>
          <span>{meta.options[0]} - {meta.options[3]} stays with your application.</span>
          <div className="fallback-path-actions">
            <button type="button" className="demo-button small primary">Enter address manually</button>
            <button type="button" className="demo-button small">Try another postcode</button>
            <button type="button" className="demo-button small">Get help</button>
          </div>
        </div>
        <div className="fallback-path-note" role="status">
          <strong>Alternate route shown</strong>
          <span>Manual entry and support explain what carries over before the user switches paths.</span>
        </div>
      </div>
    );
  }

  if (patternId === "retry") {
    if (!good) {
      return (
        <div className="bad-ui-sample retry-static-preview">
          <div className="retry-request-card bad">
            <strong>Something failed</strong>
            <span>Try again</span>
            <button type="button">Submit again</button>
          </div>
          <p className="demo-status">No operation scope, attempt state, cooldown, or duplicate guard is visible.</p>
        </div>
      );
    }

    return (
      <div className="quality-example retry-static-preview">
        <div className="retry-request-card">
          <strong>Export CSV failed</strong>
          <span>{meta.options[0]} - {meta.options[3]} - saved filter retained</span>
          <button type="button" className="demo-button small primary">Retry export</button>
        </div>
        <div className="retry-state-note" role="status">
          <strong>Attempt 1 of 3</strong>
          <span>Retry repeats the same request and disables duplicate submission while sending.</span>
        </div>
      </div>
    );
  }

  if (patternId === "restore-from-trash") {
    if (!good) {
      return (
        <div className="bad-ui-sample trash-static-preview">
          <div className="trash-row bad">
            <span>File 1</span>
            <span>Unknown location</span>
            <button type="button">Restore</button>
            <button type="button">Delete forever</button>
          </div>
          <p className="demo-status">Trash hides identity, path, deadline, and final-loss risk.</p>
        </div>
      );
    }

    return (
      <div className="quality-example trash-static-preview">
        <div className="trash-row">
          <span>
            <strong>{meta.options[0]}</strong>
            <small>Finance / Q2 - deleted yesterday by Maya - 29 days left</small>
          </span>
          <button type="button" className="demo-button small primary">Restore to Finance / Q2</button>
        </div>
        <div className="trash-restore-note" role="status">
          <strong>Recovery context shown</strong>
          <span>Original location, actor, file type, and retention deadline are visible before restore.</span>
        </div>
      </div>
    );
  }

  if (patternId === "redo") {
    if (!good) {
      return (
        <div className="bad-ui-sample redo-static-preview">
          <div className="redo-toolbar">
            <button type="button">Undo</button>
            <button type="button">Redo</button>
          </div>
          <div className="redo-document">
            <span>1. {meta.options[0]}</span>
            <span>2. {meta.options[1]}</span>
            <span>3. {meta.options[2]}</span>
          </div>
          <p className="demo-status">Redo appears active with no stack, target, or branch state.</p>
        </div>
      );
    }

    return (
      <div className="quality-example redo-static-preview">
        <div className="redo-toolbar" aria-label="Editor history controls">
          <button type="button" className="demo-button small">Undo move</button>
          <button type="button" className="demo-button small primary">Redo move</button>
        </div>
        <div className="redo-document">
          <span>1. {meta.options[0]}</span>
          <span>2. {meta.options[2]}</span>
          <span>3. {meta.options[1]}</span>
        </div>
        <div className="redo-stack-panel">
          <strong>Redo available</strong>
          <span>Move {meta.options[2]} before {meta.options[1]}</span>
        </div>
      </div>
    );
  }

  if (!good) {
    return (
      <div className="bad-ui-sample">
        <div className="result-preview">
          <span>{meta.options[0]}</span>
          <button type="button">x</button>
        </div>
        <p className="demo-status">Done. No recovery state or object-specific undo.</p>
      </div>
    );
  }

  return (
    <div className="quality-example">
      <div className="mini-result-list undo-list-preview" aria-label="Task list before recovery">
        {meta.options.slice(0, 2).map((item, index) => (
          <div className="pattern-row inline-row" key={item}>
            <span>{item}</span>
            <button type="button" className="demo-button small" disabled={index === 1}>Delete</button>
          </div>
        ))}
      </div>
      <div className="undo-recovery-panel" role="status">
        <strong>{meta.options[1]} deleted</strong>
        <span>Recoverable until committed.</span>
        <div className="demo-row">
          <button type="button" className="demo-button small primary">Undo task</button>
          <button type="button" className="demo-button small">Commit deletion</button>
        </div>
      </div>
    </div>
  );
}

type FakeUndoGoodMode =
  | "capturedState"
  | "exactRestore"
  | "externalBlocked"
  | "expiredLabelled"
  | "multipleTargets"
  | "partialLabelled";

type FakeUndoBadMode =
  | "noStateCaptured"
  | "partialRestore"
  | "externalEffect"
  | "overwrittenTarget"
  | "expiredStillActive"
  | "wrongItem"
  | "toastVanished"
  | "bulkPartial";

const fakeUndoGoodModes: Array<{ mode: FakeUndoGoodMode; label: string }> = [
  { mode: "capturedState", label: "Captured prior state" },
  { mode: "exactRestore", label: "Exact restore" },
  { mode: "externalBlocked", label: "External blocked" },
  { mode: "expiredLabelled", label: "Expired labelled" },
  { mode: "multipleTargets", label: "Multiple targets" },
  { mode: "partialLabelled", label: "Partial labelled" }
];

const fakeUndoBadModes: Array<{ mode: FakeUndoBadMode; label: string }> = [
  { mode: "noStateCaptured", label: "No state captured" },
  { mode: "partialRestore", label: "Partial restore" },
  { mode: "externalEffect", label: "External effect" },
  { mode: "overwrittenTarget", label: "Overwritten target" },
  { mode: "expiredStillActive", label: "Expired still active" },
  { mode: "wrongItem", label: "Wrong item" },
  { mode: "toastVanished", label: "Toast vanished" },
  { mode: "bulkPartial", label: "Bulk partial" }
];

const fakeUndoGoodCopy: Record<FakeUndoGoodMode, string> = {
  capturedState: "Captured prior state stores row ID, parent list, sort position, labels, owner, comments, and selection before removal.",
  exactRestore: "Exact restore returns Quarterly report with its original owner, labels, comments, list position, count, and focus target.",
  externalBlocked: "External blocked does not offer Undo after a board invite email leaves the system; it offers View activity instead.",
  expiredLabelled: "Expired labelled removes Undo after the recovery window and points to Trash or final status instead of a failing button.",
  multipleTargets: "Multiple targets show separate recovery records so one Undo cannot overwrite another recent action.",
  partialLabelled: "Partial labelled says Restore comments or Request admin recovery instead of claiming full Undo."
};

const fakeUndoBadCopy: Record<FakeUndoBadMode, string> = {
  noStateCaptured: "No state captured: the UI shows Undo after deletion but has no saved parent, order, permissions, or comments.",
  partialRestore: "Partial restore: the row name returns but comments, labels, sharing, and list position are gone.",
  externalEffect: "External effect: Undo claims a sent invite was recalled even though the email and permission notification already left.",
  overwrittenTarget: "Overwritten target: a second delete overwrote the first recovery payload, so Undo points at the wrong item.",
  expiredStillActive: "Expired still active: the button remains visible after the server committed final deletion and then fails.",
  wrongItem: "Wrong item: the vague Undo button restores Vendor renewal after the user deleted Quarterly report.",
  toastVanished: "Toast vanished: the only recovery path disappeared before keyboard or screen reader users could reach it.",
  bulkPartial: "Bulk partial: the batch says restored, but two selected items failed due to permissions and missing parents."
};

function FakeUndoGoodUi() {
  return (
    <div className="quality-example fake-undo-static" aria-label="Truthful undo preview">
      <div className="fake-undo-list">
        <div className="fake-undo-row">
          <span>
            <strong>Quarterly report</strong>
            <small>Owner Maya - Finance / Q2 - 3 comments - position 2</small>
          </span>
          <button type="button" className="demo-button small">Archive</button>
        </div>
      </div>
      <div className="fake-undo-recovery" role="status">
        <strong>Quarterly report archived</strong>
        <span>Captured: ID, parent, sort position, labels, owner, comments, and selection.</span>
        <button type="button" className="demo-button small primary">Undo archive</button>
      </div>
    </div>
  );
}

function FakeUndoBadUi() {
  return (
    <div className="bad-ui-sample fake-undo-static bad" aria-label="Fake undo preview">
      <div className="fake-undo-toast bad">
        <strong>Quarterly report deleted</strong>
        <span>Undo</span>
      </div>
      <div className="fake-undo-row bad">
        <span>
          <strong>Quarterly report?</strong>
          <small>Parent, comments, labels, owner, and permissions were not captured.</small>
        </span>
        <button type="button">Undo</button>
      </div>
      <p className="demo-status">The UI promises reversal without the state needed to restore the task.</p>
    </div>
  );
}

function FakeUndoGoodPanel({ mode }: { mode: FakeUndoGoodMode }) {
  const showMultiple = mode === "multipleTargets";
  const showExternal = mode === "externalBlocked";
  const showPartial = mode === "partialLabelled";
  return (
    <section className={`fake-undo-panel is-${mode}`} aria-label="Truthful undo contract">
      <div className="fake-undo-summary">
        <strong>{showExternal ? "No undo for external side effect" : mode === "expiredLabelled" ? "Undo window ended honestly" : showPartial ? "Partial recovery labelled honestly" : "Undo state captured before commit"}</strong>
        <span>{fakeUndoGoodCopy[mode]}</span>
      </div>
      <div className="fake-undo-state-grid">
        <div><span>Row ID</span><strong>task-482</strong></div>
        <div><span>Parent</span><strong>Finance / Q2</strong></div>
        <div><span>Position</span><strong>2 of 6</strong></div>
        <div><span>Relationships</span><strong>Owner, labels, comments</strong></div>
      </div>
      {showMultiple ? (
        <div className="fake-undo-queue">
          <div><strong>Undo archive Quarterly report</strong><span>Restores task-482 to position 2.</span></div>
          <div><strong>Undo move Vendor renewal</strong><span>Restores task-519 to Legal review.</span></div>
        </div>
      ) : showExternal ? (
        <div className="fake-undo-recovery warning" role="status">
          <strong>Board invite sent</strong>
          <span>Email already left the system. Undo is unavailable; view activity or revoke access.</span>
          <button type="button" className="demo-button small">View activity</button>
        </div>
      ) : showPartial ? (
        <div className="fake-undo-recovery warning" role="status">
          <strong>Partial recovery available</strong>
          <span>Comments can be restored, but external notification cannot be recalled.</span>
          <button type="button" className="demo-button small">Restore comments</button>
        </div>
      ) : (
        <div className="fake-undo-recovery" role="status">
          <strong>{mode === "expiredLabelled" ? "Undo expired" : mode === "exactRestore" ? "Quarterly report restored" : "Quarterly report archived"}</strong>
          <span>{mode === "expiredLabelled" ? "Final deletion committed. Open Trash for durable recovery." : mode === "exactRestore" ? "Owner, labels, comments, count, position, and focus target returned." : "Undo is available until the delayed commit boundary."}</span>
          {mode === "expiredLabelled" ? <button type="button" className="demo-button small">Open trash</button> : <button type="button" className="demo-button small primary">Undo archive</button>}
        </div>
      )}
    </section>
  );
}

function FakeUndoGoodUx() {
  const [mode, setMode] = useState<FakeUndoGoodMode>("capturedState");
  return (
    <div className="quality-example fake-undo-demo">
      <FakeUndoGoodPanel mode={mode} />
      <div className="demo-row fake-undo-controls">
        {fakeUndoGoodModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{fakeUndoGoodCopy[mode]}</p>
    </div>
  );
}

function FakeUndoBadPanel({ mode }: { mode: FakeUndoBadMode }) {
  const isExternal = mode === "externalEffect";
  const isBulk = mode === "bulkPartial";
  return (
    <section className={`fake-undo-bad-panel is-${mode}`} aria-label="Fake undo failure">
      <div className="fake-undo-toast bad">
        <strong>{isExternal ? "Board invite sent" : isBulk ? "4 items restored" : "Quarterly report deleted"}</strong>
        <button type="button">Undo</button>
      </div>
      <div className="fake-undo-state-grid bad">
        <div><span>Prior state</span><strong>{mode === "noStateCaptured" ? "Missing" : mode === "overwrittenTarget" ? "Overwritten" : "Partial"}</strong></div>
        <div><span>External effects</span><strong>{isExternal ? "Already sent" : "Unknown"}</strong></div>
        <div><span>Target</span><strong>{mode === "wrongItem" ? "Wrong row" : mode === "bulkPartial" ? "Mixed batch" : "Ambiguous"}</strong></div>
        <div><span>Outcome</span><strong>{mode === "toastVanished" ? "Unreachable" : mode === "expiredStillActive" ? "Fails late" : "Misleading"}</strong></div>
      </div>
      <div className="fake-undo-row bad">
        <span>
          <strong>{mode === "wrongItem" ? "Vendor renewal restored" : mode === "partialRestore" ? "Quarterly report name restored" : mode === "bulkPartial" ? "2 restored, 2 failed" : "Undo did not reverse the action"}</strong>
          <small>{fakeUndoBadCopy[mode]}</small>
        </span>
      </div>
    </section>
  );
}

function FakeUndoBadUx() {
  const [mode, setMode] = useState<FakeUndoBadMode>("noStateCaptured");
  return (
    <div className="quality-example fake-undo-bad-demo">
      <FakeUndoBadPanel mode={mode} />
      <div className="demo-row fake-undo-controls">
        {fakeUndoBadModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{fakeUndoBadCopy[mode]}</p>
    </div>
  );
}

function UndoGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "fake-undo") return <FakeUndoGoodUx />;
  if (patternId === "unsaved-changes-prompt") return <UnsavedChangesPromptGoodUx meta={meta} />;
  if (patternId === "exit-warning") return <ExitWarningGoodUx meta={meta} />;
  if (patternId === "session-timeout-warning") return <SessionTimeoutGoodUx meta={meta} />;
  if (patternId === "autosave-recovery") return <AutosaveRecoveryGoodUx meta={meta} />;
  if (patternId === "conflict-resolution") return <ConflictResolutionGoodUx meta={meta} />;
  if (patternId === "permission-recovery") return <PermissionRecoveryGoodUx meta={meta} />;
  if (patternId === "merge-conflict-resolver") return <MergeConflictResolverGoodUx meta={meta} />;
  if (patternId === "graceful-degradation") return <GracefulDegradationGoodUx meta={meta} />;
  if (patternId === "fallback-path") return <FallbackPathGoodUx meta={meta} />;
  if (patternId === "retry") return <RetryGoodUx meta={meta} />;
  if (patternId === "restore-from-trash") return <RestoreTrashGoodUx meta={meta} />;
  if (patternId === "redo") return <RedoGoodUx meta={meta} />;

  const [items, setItems] = useState(meta.options);
  const [pending, setPending] = useState("");
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [status, setStatus] = useState("Ready");
  const [history, setHistory] = useState<string[]>(["No pending recovery"]);

  function deleteItem(item: string, index: number) {
    if (pending) {
      setHistory([`Committed ${pending} before starting a new recovery`]);
    }
    setItems((current) => current.filter((value) => value !== item));
    setPending(item);
    setPendingIndex(index);
    setStatus(`${item} deleted; undo available`);
    setHistory([`${item} is recoverable`]);
  }

  function undo() {
    if (!pending) return;
    const restoreAt = pendingIndex ?? 0;
    setItems((current) => {
      const restored = [...current];
      restored.splice(Math.min(restoreAt, restored.length), 0, pending);
      return restored;
    });
    setStatus(`${pending} restored`);
    setHistory([`Restored ${pending}`]);
    setPending("");
    setPendingIndex(null);
  }

  function commit() {
    if (!pending) return;
    setStatus(`${pending} deletion final`);
    setHistory([`Committed deletion of ${pending}`]);
    setPending("");
    setPendingIndex(null);
  }

  return (
    <div className="quality-example">
      <div className="mini-result-list undo-task-list" aria-label="Recoverable task list">
        {items.map((item, index) => (
          <div className="pattern-row inline-row" key={item}>
            <span>{item}</span>
            <button type="button" className="demo-button small" onClick={() => deleteItem(item, index)}>Delete</button>
          </div>
        ))}
      </div>
      {pending && (
        <div className="undo-recovery-panel" role="status">
          <strong>{pending} deleted</strong>
          <span>Undo restores it to the task list before the deletion is final.</span>
          <div className="demo-row">
            <button type="button" className="demo-button small primary" onClick={undo}>Undo task</button>
            <button type="button" className="demo-button small" onClick={commit}>Commit deletion</button>
          </div>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{status}</p>
      <ol className="state-history undo-history" aria-label="Undo state history">
        {history.map((entry) => <li key={entry}>{entry}</li>)}
      </ol>
    </div>
  );
}

function UndoBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "fake-undo") return <FakeUndoBadUx />;
  if (patternId === "unsaved-changes-prompt") return <UnsavedChangesPromptBadUx meta={meta} />;
  if (patternId === "exit-warning") return <ExitWarningBadUx meta={meta} />;
  if (patternId === "session-timeout-warning") return <SessionTimeoutBadUx meta={meta} />;
  if (patternId === "autosave-recovery") return <AutosaveRecoveryBadUx meta={meta} />;
  if (patternId === "conflict-resolution") return <ConflictResolutionBadUx meta={meta} />;
  if (patternId === "permission-recovery") return <PermissionRecoveryBadUx meta={meta} />;
  if (patternId === "merge-conflict-resolver") return <MergeConflictResolverBadUx meta={meta} />;
  if (patternId === "graceful-degradation") return <GracefulDegradationBadUx meta={meta} />;
  if (patternId === "fallback-path") return <FallbackPathBadUx meta={meta} />;
  if (patternId === "retry") return <RetryBadUx meta={meta} />;
  if (patternId === "restore-from-trash") return <RestoreTrashBadUx meta={meta} />;
  if (patternId === "redo") return <RedoBadUx meta={meta} />;

  const [items, setItems] = useState(meta.options);
  const [status, setStatus] = useState("Ready");
  return (
    <div className="quality-example">
      {items.slice(0, 2).map((item) => (
        <div className="pattern-row inline-row" key={item}>
          <span>{item}</span>
          <button type="button" onClick={() => { setItems((current) => current.filter((value) => value !== item)); setStatus("Removed permanently; no undo state captured"); }}>x</button>
        </div>
      ))}
      <p className="demo-status">{status}</p>
    </div>
  );
}

function UnsavedChangesPromptGoodUx({ meta }: { meta: PatternMeta }) {
  type UnsavedMode = "clean" | "dirty" | "close" | "switchRecord" | "review" | "saving" | "failed" | "saved" | "discarded" | "kept";
  const [mode, setMode] = useState<UnsavedMode>("dirty");
  const [phone, setPhone] = useState("+1 415 555 0186");
  const [department, setDepartment] = useState("Enterprise renewals");
  const [savedPhone, setSavedPhone] = useState("+1 415 555 0198");
  const [savedDepartment, setSavedDepartment] = useState("Enterprise success");
  const [target, setTarget] = useState("close editor");
  const [status, setStatus] = useState("Two fields are dirty. Closing or switching opens the unsaved changes prompt.");
  const promptOpen = mode === "close" || mode === "switchRecord" || mode === "review" || mode === "saving" || mode === "failed";
  const isFieldDirty = phone !== savedPhone || department !== savedDepartment;
  const isDirty = isFieldDirty && (mode === "dirty" || mode === "close" || mode === "switchRecord" || mode === "review" || mode === "saving" || mode === "failed" || mode === "kept");
  const modeCopy: Record<UnsavedMode, string> = {
    clean: "No changed fields. Close and record switch continue without interruption.",
    dirty: "Phone number and department differ from the last saved contact.",
    close: "Close was requested, so the prompt asks what to do with the dirty contact fields.",
    switchRecord: `Switching to ${meta.options[2]} would replace the dirty editor unless the user saves or discards first.`,
    review: "Review shows field-level before and after values before save or discard.",
    saving: "Saving changes before continuing. The editor cannot close until this request finishes.",
    failed: "Save failed. The prompt stays open and the edited values remain available.",
    saved: "Changes saved. The requested close or switch can now continue without another prompt.",
    discarded: "Dirty fields were intentionally discarded and the target action continued.",
    kept: "User stayed in the editor; all dirty field values are preserved."
  };

  function makeDirty() {
    setPhone(savedPhone === "+1 415 555 0186" ? "+1 415 555 0133" : "+1 415 555 0186");
    setDepartment(savedDepartment === "Enterprise renewals" ? "Strategic accounts" : "Enterprise renewals");
    setMode("dirty");
    setTarget("close editor");
    setStatus("Phone number and department are dirty. Close or switch will ask for a decision.");
  }

  function attempt(nextMode: "close" | "switchRecord", nextTarget: string) {
    setTarget(nextTarget);
    if (!isDirty) {
      setMode("clean");
      setStatus(`Clean ${meta.subject} can ${nextTarget} without an unsaved changes prompt.`);
      return;
    }
    setMode(nextMode);
    setStatus(`${nextTarget} is paused until the user saves, discards, reviews, or keeps editing.`);
  }

  function keepEditing() {
    setMode("kept");
    setStatus("Prompt closed; dirty values are still in the editor.");
  }

  function reviewChanges() {
    setMode("review");
    setStatus("Changed fields are visible before the user saves or discards.");
  }

  function saveChanges() {
    setMode("saving");
    setStatus(`Saving ${meta.options[0]} and ${meta.options[1]} before ${target}.`);
  }

  function finishSave() {
    setSavedPhone(phone);
    setSavedDepartment(department);
    setMode("saved");
    setStatus(`Saved ${meta.subject}; ${target} can continue without prompting again.`);
  }

  function failSave() {
    setMode("failed");
    setStatus("Save failed; the prompt keeps the editor open with dirty values intact.");
  }

  function discardChanges() {
    setPhone(savedPhone);
    setDepartment(savedDepartment);
    setMode("discarded");
    setStatus(`Discarded dirty ${meta.subject} fields and continued to ${target}.`);
  }

  function cleanClose() {
    setPhone("+1 415 555 0198");
    setDepartment("Enterprise success");
    setSavedPhone("+1 415 555 0198");
    setSavedDepartment("Enterprise success");
    setTarget("close editor");
    setMode("clean");
    setStatus("No dirty fields remain, so the editor closes without a prompt.");
  }

  return (
    <div className="quality-example unsaved-prompt-demo">
      <div className={`unsaved-prompt-editor is-${mode}`}>
        <div className="unsaved-prompt-header">
          <div>
            <strong>{meta.subject}</strong>
            <span>{modeCopy[mode]}</span>
          </div>
          <em>{isDirty ? "Dirty editor" : "Clean editor"}</em>
        </div>
        <label>
          <span>{meta.options[0]}</span>
          <input
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setMode("dirty");
              setStatus(`${meta.options[0]} changed; prompt will protect close and switch actions.`);
            }}
          />
        </label>
        <label>
          <span>{meta.options[1]}</span>
          <input
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setMode("dirty");
              setStatus(`${meta.options[1]} changed; prompt will protect close and switch actions.`);
            }}
          />
        </label>
        <div className="unsaved-prompt-dirty-list" aria-label="Changed fields">
          <span className={phone !== savedPhone ? "is-dirty" : "is-clean"}>{meta.options[0]} {phone === savedPhone ? "unchanged" : "changed"}</span>
          <span className={department !== savedDepartment ? "is-dirty" : "is-clean"}>{meta.options[1]} {department === savedDepartment ? "unchanged" : "changed"}</span>
          <span>{target}</span>
        </div>
      </div>

      {promptOpen && (
        <div className={`unsaved-prompt-card is-${mode}`} role="alertdialog" aria-modal="true" aria-labelledby="unsaved-prompt-title" aria-describedby="unsaved-prompt-desc">
          <strong id="unsaved-prompt-title">{mode === "failed" ? "Save failed before closing" : `Save changes to ${meta.subject}?`}</strong>
          <span id="unsaved-prompt-desc">
            {mode === "saving"
              ? `${meta.options[0]} and ${meta.options[1]} are being saved before ${target}.`
              : mode === "review"
                ? "Review the changed fields, then save, discard, or keep editing."
                : `${meta.options[0]} and ${meta.options[1]} have unsaved changes. ${target} will replace this edit buffer unless you save or discard deliberately.`}
          </span>
          {mode === "review" && (
            <div className="unsaved-prompt-review" aria-label="Field changes">
              <span><strong>{meta.options[0]}</strong> {savedPhone} to {phone}</span>
              <span><strong>{meta.options[1]}</strong> {savedDepartment} to {department}</span>
            </div>
          )}
          <div className="unsaved-prompt-actions">
            <button type="button" className="demo-button small primary" onClick={keepEditing} disabled={mode === "saving"}>Keep editing</button>
            <button type="button" className="demo-button small" onClick={reviewChanges} disabled={mode === "saving"}>Review changes</button>
            <button type="button" className="demo-button small" onClick={saveChanges} disabled={mode === "saving"}>Save changes</button>
            <button type="button" className="demo-button small" onClick={finishSave} disabled={mode !== "saving"}>Finish save</button>
            <button type="button" className="demo-button small" onClick={failSave} disabled={mode !== "saving"}>Fail save</button>
            <button type="button" className="demo-button small danger" onClick={discardChanges} disabled={mode === "saving"}>Discard changes</button>
          </div>
        </div>
      )}

      <div className="demo-row unsaved-prompt-controls">
        <button type="button" className={mode === "dirty" ? "demo-button small primary" : "demo-button small"} onClick={makeDirty}>Make dirty</button>
        <button type="button" className={mode === "close" ? "demo-button small primary" : "demo-button small"} onClick={() => attempt("close", "close editor")}>Close editor</button>
        <button type="button" className={mode === "switchRecord" ? "demo-button small primary" : "demo-button small"} onClick={() => attempt("switchRecord", `switch to ${meta.options[2]}`)}>Switch record</button>
        <button type="button" className="demo-button small" onClick={reviewChanges} disabled={!promptOpen}>Review changes</button>
        <button type="button" className="demo-button small" onClick={saveChanges} disabled={!promptOpen || mode === "saving"}>Save changes</button>
        <button type="button" className="demo-button small danger" onClick={discardChanges} disabled={!promptOpen}>Discard</button>
        <button type="button" className="demo-button small" onClick={cleanClose}>Clean close</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function UnsavedChangesPromptBadUx({ meta }: { meta: PatternMeta }) {
  type UnsavedMisuse = "vague" | "pendingClose" | "promptClean" | "fieldLoss" | "noStay" | "wrongScope" | "toastOnly";
  const [mode, setMode] = useState<UnsavedMisuse>("vague");
  const copy: Record<UnsavedMisuse, string> = {
    vague: "OK and Cancel do not say whether the dirty fields are saved, discarded, or preserved.",
    pendingClose: "The editor closes immediately after Save even though the request is still pending.",
    promptClean: "A clean editor still prompts, so users learn to dismiss the warning.",
    fieldLoss: "Switching records clears the dirty phone and department values before the user decides.",
    noStay: "The prompt offers only destructive or ambiguous exits and no way to keep editing.",
    wrongScope: "The prompt talks about leaving the site while the user is only switching contact records.",
    toastOnly: "A disappearing toast reports unsaved changes after the editor has already closed."
  };
  const dirtyValue = mode === "fieldLoss" ? "" : "+1 415 555 0186";

  return (
    <div className="quality-example unsaved-prompt-bad-ux">
      <div className={`unsaved-prompt-editor bad is-${mode}`}>
        <div className="unsaved-prompt-header">
          <div>
            <strong>{mode === "promptClean" ? "No changes" : meta.subject}</strong>
            <span>{copy[mode]}</span>
          </div>
          <em>{mode === "promptClean" ? "Clean" : mode === "pendingClose" ? "Closing..." : "Dirty risk"}</em>
        </div>
        <label>
          <span>{meta.options[0]}</span>
          <input value={mode === "promptClean" ? "+1 415 555 0198" : dirtyValue} readOnly />
        </label>
        <label>
          <span>{meta.options[1]}</span>
          <input value={mode === "promptClean" ? "Enterprise success" : mode === "fieldLoss" ? "" : "Enterprise renewals"} readOnly />
        </label>
        {mode === "toastOnly" && <div className="unsaved-prompt-toast">Changes were not saved</div>}
      </div>
      <div className="unsaved-prompt-card bad">
        <strong>{mode === "wrongScope" ? "Leave site?" : mode === "pendingClose" ? "Saving..." : "Are you sure?"}</strong>
        <span>{copy[mode]} {meta.options[3]} does not get a reliable save, discard, review, and keep-editing contract.</span>
        <div className="unsaved-prompt-actions">
          <button type="button" className="demo-button small danger">{mode === "pendingClose" ? "Closed" : "OK"}</button>
          <button type="button" className="demo-button small" disabled={mode === "noStay"}>{mode === "noStay" ? "Unavailable" : "Cancel"}</button>
        </div>
      </div>
      <div className="demo-row unsaved-prompt-controls">
        <button type="button" className={mode === "vague" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague")}>Vague</button>
        <button type="button" className={mode === "pendingClose" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("pendingClose")}>Pending close</button>
        <button type="button" className={mode === "promptClean" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("promptClean")}>Clean prompt</button>
        <button type="button" className={mode === "fieldLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fieldLoss")}>Field loss</button>
        <button type="button" className={mode === "noStay" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noStay")}>No stay</button>
        <button type="button" className={mode === "wrongScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongScope")}>Wrong scope</button>
        <button type="button" className={mode === "toastOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("toastOnly")}>Toast only</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function ExitWarningGoodUx({ meta }: { meta: PatternMeta }) {
  type ExitMode = "clean" | "dirty" | "internal" | "browser" | "external" | "signout" | "pendingSave" | "saveFailed" | "saved" | "discarded";
  const [mode, setMode] = useState<ExitMode>("dirty");
  const [summary, setSummary] = useState("Community kitchen extension");
  const [warningOpen, setWarningOpen] = useState(false);
  const [destination, setDestination] = useState("review page");
  const [status, setStatus] = useState(`${meta.options[0]} has unsaved edits. Navigation is guarded until saved or discarded.`);

  const isRisky = mode !== "clean" && mode !== "saved" && mode !== "discarded";
  const modeCopy: Record<ExitMode, string> = {
    clean: "No dirty state. Internal navigation should continue without an interruption.",
    dirty: "Unsaved text is present and leaving would lose the latest answer.",
    internal: "An in-app route change was attempted. The destination is retained while the warning is resolved.",
    browser: "Browser close or reload uses the browser-owned dialog; the page already names the unsaved work.",
    external: "An external help link was attempted. Leaving would abandon the current unsaved section.",
    signout: "Sign out was attempted while the application has unsaved work.",
    pendingSave: "Save and leave is waiting for the save request to finish before continuing.",
    saveFailed: "Save failed. The warning keeps the user here with retry and stay choices.",
    saved: "Latest changes are saved. The departure guard has been removed.",
    discarded: "The stated unsaved work was discarded and the intended destination can continue."
  };

  function attempt(nextMode: ExitMode, nextDestination: string) {
    setMode(nextMode);
    setDestination(nextDestination);
    if (nextMode === "clean" || nextMode === "saved" || nextMode === "discarded") {
      setWarningOpen(false);
      setStatus(modeCopy[nextMode]);
      return;
    }
    setWarningOpen(true);
    setStatus(`${nextDestination} attempted. ${modeCopy[nextMode]}`);
  }

  function saveAndLeave() {
    setMode("pendingSave");
    setWarningOpen(true);
    setStatus("Saving Project summary before leaving; destination is held.");
  }

  function finishSave() {
    setMode("saved");
    setWarningOpen(false);
    setStatus(`Saved ${summary || "the current draft"} and continued to ${destination}.`);
  }

  function failSave() {
    setMode("saveFailed");
    setWarningOpen(true);
    setStatus("Save failed. Stay editing or retry before leaving.");
  }

  function stayEditing() {
    setWarningOpen(false);
    setMode("dirty");
    setStatus("Stayed on the application with all unsaved values intact.");
  }

  function discardAndLeave() {
    setWarningOpen(false);
    setMode("discarded");
    setStatus(`${meta.options[0]} edits discarded; continued to ${destination}.`);
  }

  function resetDirty() {
    setMode("dirty");
    setSummary("Community kitchen extension");
    setWarningOpen(false);
    setDestination("review page");
    setStatus(`${meta.options[0]} has unsaved edits. Navigation is guarded until saved or discarded.`);
  }

  return (
    <div className="quality-example exit-warning-demo">
      <div className={`exit-warning-workspace is-${mode}`}>
        <div className="exit-warning-state">
          <strong>{mode === "saved" ? "Saved state" : mode === "discarded" ? "Discarded state" : isRisky ? "Unsaved work" : "Clean page"}</strong>
          <span>{modeCopy[mode]}</span>
          <em>{meta.options[3]}</em>
        </div>
        <label className="exit-warning-field">
          <span>{meta.options[0]}</span>
          <textarea
            rows={3}
            value={summary}
            onChange={(event) => {
              setSummary(event.target.value);
              setMode("dirty");
              setWarningOpen(false);
              setStatus("Project summary changed; exit warning is now active for departure attempts.");
            }}
          />
        </label>
        <div className="exit-warning-dirty-list" aria-label="Dirty work summary">
          <span className={isRisky ? "is-dirty" : "is-clean"}>{meta.options[0]} {isRisky ? "not saved" : "safe"}</span>
          <span className={mode === "pendingSave" ? "is-pending" : "is-clean"}>{mode === "pendingSave" ? "Save in progress" : meta.options[1]}</span>
          <span>{destination}</span>
        </div>
      </div>

      {warningOpen && (
        <div className={`exit-warning-card is-${mode}`} role="alertdialog" aria-modal="true" aria-labelledby="exit-warning-title" aria-describedby="exit-warning-desc">
          <strong id="exit-warning-title">{mode === "saveFailed" ? "Save failed before leaving" : mode === "browser" ? "Browser leave protection active" : "Leave with unsaved work?"}</strong>
          <span id="exit-warning-desc">
            {mode === "browser"
              ? "The browser controls close and reload copy. This page already shows what is unsaved before the browser prompt appears."
              : mode === "pendingSave"
                ? `Saving ${meta.options[0]} before continuing to ${destination}.`
                : `${meta.options[0]} is not saved. Leaving for ${destination} can discard the latest edit.`}
          </span>
          <div className="exit-warning-actions">
            <button type="button" className="demo-button small primary" onClick={stayEditing}>Stay editing</button>
            <button type="button" className="demo-button small" onClick={saveAndLeave} disabled={mode === "pendingSave" || mode === "browser"}>Save and leave</button>
            <button type="button" className="demo-button small" onClick={finishSave} disabled={mode !== "pendingSave"}>Finish save</button>
            <button type="button" className="demo-button small" onClick={failSave} disabled={mode !== "pendingSave"}>Fail save</button>
            <button type="button" className="demo-button small danger" onClick={discardAndLeave}>Discard and leave</button>
          </div>
        </div>
      )}

      <div className="demo-row exit-warning-controls">
        <button type="button" className={mode === "dirty" ? "demo-button small primary" : "demo-button small"} onClick={resetDirty}>Make dirty</button>
        <button type="button" className={mode === "internal" ? "demo-button small primary" : "demo-button small"} onClick={() => attempt("internal", meta.options[2])}>Internal route</button>
        <button type="button" className={mode === "browser" ? "demo-button small primary" : "demo-button small"} onClick={() => attempt("browser", "browser reload")}>Browser close</button>
        <button type="button" className={mode === "external" ? "demo-button small primary" : "demo-button small"} onClick={() => attempt("external", "external help link")}>External link</button>
        <button type="button" className={mode === "signout" ? "demo-button small primary" : "demo-button small"} onClick={() => attempt("signout", "sign out")}>Sign out</button>
        <button type="button" className="demo-button small" onClick={finishSave}>Mark saved</button>
        <button type="button" className={mode === "clean" ? "demo-button small primary" : "demo-button small"} onClick={() => attempt("clean", "dashboard")}>Clean nav</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function ExitWarningBadUx({ meta }: { meta: PatternMeta }) {
  type ExitMisuse = "warnAlways" | "noWarning" | "vague" | "trapped" | "staleAfterSave" | "toastOnly";
  const [mode, setMode] = useState<ExitMisuse>("warnAlways");
  const copy: Record<ExitMisuse, string> = {
    warnAlways: "The warning appears even when nothing changed, so users learn to dismiss it.",
    noWarning: "A dirty form leaves immediately and loses the latest answer.",
    vague: "The warning does not say what work is at risk or where the user is going.",
    trapped: "The app blocks leaving even after the user chooses to discard changes.",
    staleAfterSave: "The draft is saved but the dirty flag remains, so every clean navigation still warns.",
    toastOnly: "A disappearing toast is the only warning before navigation destroys the work."
  };

  return (
    <div className="quality-example exit-warning-bad-ux">
      <div className={`exit-warning-workspace bad is-${mode}`}>
        <div className="exit-warning-state bad">
          <strong>{mode === "noWarning" ? "Navigating away" : mode === "staleAfterSave" ? "Saved" : "Leave page?"}</strong>
          <span>{mode === "toastOnly" ? "" : mode === "noWarning" ? "Latest answer cleared after route change." : mode === "trapped" ? "Leave is unavailable." : "Are you sure?"}</span>
        </div>
        <label className="exit-warning-field">
          <span>{meta.options[0]}</span>
          <textarea rows={3} value={mode === "noWarning" ? "" : "Community kitchen extension"} readOnly />
        </label>
        {mode === "toastOnly" && <div className="exit-warning-toast">Unsaved changes</div>}
      </div>
      <div className="exit-warning-card bad">
        <strong>{mode === "trapped" ? "Cannot leave" : mode === "staleAfterSave" ? "Dirty flag not cleared" : "Unsafe departure"}</strong>
        <span>{copy[mode]} {meta.options[3]} has no reliable save, discard, or stay contract.</span>
        <div className="exit-warning-actions">
          <button type="button" className="demo-button small danger" disabled={mode === "trapped"}>{mode === "noWarning" ? "Already left" : "Leave"}</button>
          <button type="button" className="demo-button small">{mode === "vague" ? "Cancel" : "OK"}</button>
        </div>
      </div>
      <div className="demo-row exit-warning-controls">
        <button type="button" className={mode === "warnAlways" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("warnAlways")}>Warn always</button>
        <button type="button" className={mode === "noWarning" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noWarning")}>No warning</button>
        <button type="button" className={mode === "vague" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague")}>Vague</button>
        <button type="button" className={mode === "trapped" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("trapped")}>Trapped</button>
        <button type="button" className={mode === "staleAfterSave" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleAfterSave")}>Stale after save</button>
        <button type="button" className={mode === "toastOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("toastOnly")}>Toast only</button>
      </div>
      <p className="demo-status">{copy[mode]}</p>
    </div>
  );
}

function SessionTimeoutGoodUx({ meta }: { meta: PatternMeta }) {
  type TimeoutMode = "active" | "early" | "imminent" | "extending" | "extended" | "saved" | "reauth" | "expired" | "restored";
  const [mode, setMode] = useState<TimeoutMode>("early");
  const [answer, setAnswer] = useState("Partner income changed in May.");
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [status, setStatus] = useState("Session warning is visible before the idle timeout interrupts work.");
  const copy: Record<TimeoutMode, string> = {
    active: "Session active. No warning is needed while the expiry boundary is far away.",
    early: "Idle timeout is approaching. The form remains editable and the draft status is visible.",
    imminent: "The session will end soon. Choose a policy-valid action before private data is hidden.",
    extending: "Stay signed in is checking the server session before resetting the countdown.",
    extended: "Server confirmed the session extension and reset the warning threshold.",
    saved: "Draft saved before timeout. The user can safely sign out or reauthenticate later.",
    reauth: "Security policy requires reauthentication. Work is preserved but private values are shielded.",
    expired: "Session ended. Private content is hidden until sign-in succeeds.",
    restored: "Reauthenticated user returned to the same claim step with saved work restored."
  };
  const isPrivateHidden = mode === "expired" || mode === "reauth";

  function selectMode(nextMode: TimeoutMode, nextSeconds: number, message: string) {
    setMode(nextMode);
    setSecondsLeft(nextSeconds);
    setStatus(message);
  }

  function extendSession() {
    setMode("extending");
    setStatus("Extending session against the server, not just resetting the local timer.");
  }

  function confirmExtension() {
    selectMode("extended", 900, "Server confirmed extension. Countdown reset and focus can return to the current answer.");
  }

  function saveDraft() {
    selectMode("saved", 60, `${meta.options[0]} and ${meta.options[1]} saved under ${meta.options[3]}.`);
  }

  function reauthenticate() {
    selectMode("restored", 720, `Reauthenticated and returned to ${meta.options[2]} with ${meta.options[3]}.`);
  }

  return (
    <div className="quality-example session-timeout-demo">
      <div className={`session-timeout-shell is-${mode}`}>
        <div className="session-timeout-header">
          <strong>{mode === "expired" ? "Signed out" : mode === "reauth" ? "Reauthentication required" : "Benefits claim session"}</strong>
          <span>{isPrivateHidden ? "Private details hidden" : `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")} remaining`}</span>
        </div>
        <label className="session-timeout-field">
          <span>{meta.options[0]}</span>
          <textarea
            rows={3}
            value={isPrivateHidden ? "Hidden until you sign in again" : answer}
            readOnly={isPrivateHidden}
            onChange={(event) => {
              setAnswer(event.target.value);
              selectMode("early", 120, "Answer changed; draft state and timeout warning stay connected.");
            }}
          />
        </label>
        <div className="session-timeout-state-grid" aria-label="Session preservation state">
          <span className={mode === "saved" || mode === "restored" ? "is-safe" : "is-risk"}>{mode === "saved" || mode === "restored" ? "Draft saved" : "Draft needs attention"}</span>
          <span className={mode === "reauth" || mode === "expired" ? "is-risk" : "is-safe"}>{mode === "reauth" ? "Verify again" : mode === "expired" ? "Signed out" : "Authenticated"}</span>
          <span>{meta.options[3]}</span>
        </div>
      </div>

      {mode !== "active" && (
        <div className={`session-timeout-warning is-${mode}`} role={mode === "imminent" || mode === "reauth" ? "alertdialog" : "status"} aria-live={mode === "imminent" ? "assertive" : "polite"}>
          <strong>{mode === "expired" ? "Your session ended" : mode === "reauth" ? "Verify before continuing" : mode === "saved" ? "Draft saved before timeout" : "Your session is about to end"}</strong>
          <span>{copy[mode]}</span>
          <div className="session-timeout-actions">
            <button type="button" className="demo-button small primary" onClick={extendSession} disabled={mode === "extending" || mode === "expired" || mode === "reauth"}>Stay signed in</button>
            <button type="button" className="demo-button small" onClick={confirmExtension} disabled={mode !== "extending"}>Confirm extension</button>
            <button type="button" className="demo-button small" onClick={saveDraft} disabled={mode === "expired"}>Save draft</button>
            <button type="button" className="demo-button small" onClick={reauthenticate} disabled={mode !== "reauth" && mode !== "expired"}>Reauthenticate</button>
            <button type="button" className="demo-button small danger" onClick={() => selectMode("expired", 0, "Session ended; private details are hidden and return target is retained.")}>Let expire</button>
          </div>
        </div>
      )}

      <div className="demo-row session-timeout-controls">
        <button type="button" className={mode === "active" ? "demo-button small primary" : "demo-button small"} onClick={() => selectMode("active", 900, "Session active. No warning shown yet.")}>Active</button>
        <button type="button" className={mode === "early" ? "demo-button small primary" : "demo-button small"} onClick={() => selectMode("early", 120, "Early warning shown with enough time to save or extend.")}>Early warning</button>
        <button type="button" className={mode === "imminent" ? "demo-button small primary" : "demo-button small"} onClick={() => selectMode("imminent", 30, "Imminent timeout dialog asks for action before the session ends.")}>Imminent</button>
        <button type="button" className={mode === "reauth" ? "demo-button small primary" : "demo-button small"} onClick={() => selectMode("reauth", 0, "Absolute session limit reached; reauthentication is required before continuing.")}>Reauth</button>
        <button type="button" className={mode === "restored" ? "demo-button small primary" : "demo-button small"} onClick={reauthenticate}>Restored</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function SessionTimeoutBadUx({ meta }: { meta: PatternMeta }) {
  type TimeoutMisuse = "noWarning" | "vague" | "clientOnly" | "dataLoss" | "privacyLeak" | "alertLoop";
  const [mode, setMode] = useState<TimeoutMisuse>("noWarning");
  const copy: Record<TimeoutMisuse, string> = {
    noWarning: "The user is signed out with no warning, countdown, save, or reauthentication route.",
    vague: "The notice says soon without remaining time, consequence, or a clear action.",
    clientOnly: "Stay signed in resets the page timer but the server session remains expired.",
    dataLoss: "Timeout clears the long answer instead of saving or restoring the draft.",
    privacyLeak: "Private form values remain visible behind a signed-out overlay on a shared device.",
    alertLoop: "The countdown announces every second and keeps stealing attention from the task."
  };

  return (
    <div className="quality-example session-timeout-bad-ux">
      <div className={`session-timeout-shell bad is-${mode}`}>
        <div className="session-timeout-header">
          <strong>{mode === "privacyLeak" ? "Signed out overlay" : mode === "dataLoss" ? "Session ended" : "Session notice"}</strong>
          <span>{mode === "vague" ? "Soon" : mode === "alertLoop" ? "59, 58, 57..." : "Unknown"}</span>
        </div>
        <label className="session-timeout-field">
          <span>{meta.options[0]}</span>
          <textarea rows={3} value={mode === "dataLoss" ? "" : "Partner income changed in May."} readOnly />
        </label>
      </div>
      <div className="session-timeout-warning bad">
        <strong>{mode === "clientOnly" ? "Fake extension" : mode === "privacyLeak" ? "Private content exposed" : "Timeout mishandled"}</strong>
        <span>{copy[mode]} {meta.options[3]} is not preserved through a trustworthy session contract.</span>
        <div className="session-timeout-actions">
          <button type="button" className="demo-button small danger">{mode === "clientOnly" ? "Stay signed in" : "Continue"}</button>
          <button type="button" className="demo-button small">{mode === "vague" ? "OK" : "Retry"}</button>
        </div>
      </div>
      <div className="demo-row session-timeout-controls">
        <button type="button" className={mode === "noWarning" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noWarning")}>No warning</button>
        <button type="button" className={mode === "vague" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague")}>Vague timer</button>
        <button type="button" className={mode === "clientOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("clientOnly")}>Client only</button>
        <button type="button" className={mode === "dataLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dataLoss")}>Data loss</button>
        <button type="button" className={mode === "privacyLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privacyLeak")}>Privacy leak</button>
        <button type="button" className={mode === "alertLoop" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("alertLoop")}>Alert loop</button>
      </div>
      <p className="demo-status">{copy[mode]}</p>
    </div>
  );
}

function AutosaveRecoveryGoodUx({ meta }: { meta: PatternMeta }) {
  type RecoveryMode = "failed" | "retrying" | "recovered" | "localCopy" | "restore" | "compare" | "reauth" | "continued";
  const [mode, setMode] = useState<RecoveryMode>("failed");
  const [answer, setAnswer] = useState("Partner income changed in May; payslips uploaded.");
  const [status, setStatus] = useState(`${meta.options[0]} failed to autosave. Latest local value is preserved.`);
  const copy: Record<RecoveryMode, string> = {
    failed: "Latest edit is local only. Last server save was 10:37 and the failed attempt was 10:42.",
    retrying: "Retrying the same local value with duplicate submit disabled.",
    recovered: "Autosave recovered. Server timestamp now matches the latest local value.",
    localCopy: "Local copy preserved so the user can copy or download work before trying again.",
    restore: "Restoring last server-saved version requires replacing the newer local answer.",
    compare: "Local and server versions are both visible before choosing which one survives.",
    reauth: "Session expired during save. Reauthenticate, then return to this recovery state.",
    continued: "Continue is available only after the recovered value is server-saved."
  };
  const unsafe = mode === "failed" || mode === "retrying" || mode === "localCopy" || mode === "restore" || mode === "compare" || mode === "reauth";

  function chooseMode(nextMode: RecoveryMode, message: string) {
    setMode(nextMode);
    setStatus(message);
  }

  function retrySave() {
    chooseMode("retrying", `Retrying ${meta.options[0]} with the same local value and request reference ${meta.options[3]}.`);
  }

  function recoverSave() {
    chooseMode("recovered", `${meta.options[0]} saved to the server at 10:43. Submit can continue.`);
  }

  function reset() {
    setMode("failed");
    setAnswer("Partner income changed in May; payslips uploaded.");
    setStatus(`${meta.options[0]} failed to autosave. Latest local value is preserved.`);
  }

  return (
    <div className="quality-example autosave-recovery-demo">
      <div className={`autosave-recovery-workspace is-${mode}`}>
        <div className="autosave-recovery-header">
          <strong>{mode === "recovered" || mode === "continued" ? "Autosave recovered" : mode === "reauth" ? "Reauthentication needed" : "Autosave needs recovery"}</strong>
          <span>{mode === "recovered" || mode === "continued" ? "Server saved 10:43" : mode === "restore" ? "Restore warning" : "Local copy 10:42"}</span>
        </div>
        <label className="autosave-recovery-field">
          <span>{meta.options[0]}</span>
          <textarea
            rows={3}
            value={mode === "restore" ? "Partner income changed in April." : answer}
            readOnly={mode === "restore" || mode === "reauth"}
            onChange={(event) => {
              setAnswer(event.target.value);
              chooseMode("failed", "Local value changed; autosave recovery remains active until server save succeeds.");
            }}
          />
        </label>
        <div className="autosave-recovery-grid" aria-label="Autosave evidence">
          <span className={mode === "recovered" || mode === "continued" ? "is-safe" : "is-risk"}>{mode === "recovered" || mode === "continued" ? "Latest saved" : "Latest local only"}</span>
          <span>Server 10:37</span>
          <span>{meta.options[3]}</span>
        </div>
      </div>

      <div className={`autosave-recovery-card is-${mode}`} role="status" aria-live="polite">
        <strong>{mode === "compare" ? "Compare before replacing" : mode === "restore" ? "Restore last saved?" : mode === "reauth" ? "Sign in to recover save" : "Recovery actions"}</strong>
        <span>{copy[mode]}</span>
        {mode === "compare" && (
          <div className="autosave-version-compare" aria-label="Version comparison">
            <div><strong>Local 10:42</strong><span>{answer}</span></div>
            <div><strong>Server 10:37</strong><span>Partner income changed in April.</span></div>
          </div>
        )}
        <div className="autosave-recovery-actions">
          <button type="button" className="demo-button small primary" onClick={retrySave} disabled={mode === "retrying" || mode === "recovered" || mode === "continued"}>Retry save</button>
          <button type="button" className="demo-button small" onClick={recoverSave} disabled={mode !== "retrying"}>Finish retry</button>
          <button type="button" className="demo-button small" onClick={() => chooseMode("localCopy", `Copied latest local answer for ${meta.options[3]} before retrying.`)}>Copy answer</button>
          <button type="button" className="demo-button small" onClick={() => chooseMode("compare", "Showing local and server values before choosing which one survives.")}>Compare versions</button>
          <button type="button" className="demo-button small" onClick={() => chooseMode("restore", "Restoring last saved would replace the newer local answer.")}>Restore last saved</button>
          <button type="button" className="demo-button small" onClick={() => chooseMode("reauth", "Session expired during autosave; return target and local copy are retained.")}>Reauth needed</button>
          <button type="button" className="demo-button small" onClick={() => chooseMode("continued", `Continued to ${meta.options[2]} after recovered server save.`)} disabled={unsafe}>Continue</button>
          <button type="button" className="demo-button small" onClick={reset}>Reset</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function AutosaveRecoveryBadUx({ meta }: { meta: PatternMeta }) {
  type Misuse = "staleSaved" | "toastOnly" | "dataLoss" | "overwrite" | "duplicate" | "hiddenLocal";
  const [mode, setMode] = useState<Misuse>("staleSaved");
  const copy: Record<Misuse, string> = {
    staleSaved: "A green Saved label refers to an old server value while the latest local answer failed.",
    toastOnly: "A disappearing toast is the only failed-save feedback.",
    dataLoss: "Reload clears the local answer before users can copy or retry it.",
    overwrite: "The server value overwrites the newer local value without comparison.",
    duplicate: "Submit and Retry stay active together, allowing partial or duplicate saves.",
    hiddenLocal: "A recoverable local copy exists but the UI gives no restore or download path."
  };

  return (
    <div className="quality-example autosave-recovery-bad-ux">
      <div className={`autosave-recovery-workspace bad is-${mode}`}>
        <div className="autosave-recovery-header">
          <strong>{mode === "toastOnly" ? "Could not save" : mode === "dataLoss" ? "Reloaded" : "Saved"}</strong>
          <span>{mode === "toastOnly" ? "Toast closes in 3s" : mode === "hiddenLocal" ? "Local copy hidden" : "Server 10:37"}</span>
        </div>
        <label className="autosave-recovery-field">
          <span>{meta.options[0]}</span>
          <textarea rows={3} readOnly value={mode === "dataLoss" ? "" : mode === "overwrite" ? "Partner income changed in April." : "Partner income changed in May; payslips uploaded."} />
        </label>
      </div>
      <div className="autosave-recovery-card bad">
        <strong>{mode === "duplicate" ? "Unsafe continuation" : mode === "hiddenLocal" ? "Recovery hidden" : "Autosave risk hidden"}</strong>
        <span>{copy[mode]} {meta.options[3]} is not protected by a persistent recovery surface.</span>
        <div className="autosave-recovery-actions">
          <button type="button" className="demo-button small danger">{mode === "duplicate" ? "Submit" : "Reload"}</button>
          <button type="button" className="demo-button small">{mode === "duplicate" ? "Retry save" : "OK"}</button>
        </div>
      </div>
      <div className="demo-row autosave-recovery-controls">
        <button type="button" className={mode === "staleSaved" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleSaved")}>Stale saved</button>
        <button type="button" className={mode === "toastOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("toastOnly")}>Toast only</button>
        <button type="button" className={mode === "dataLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dataLoss")}>Data loss</button>
        <button type="button" className={mode === "overwrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overwrite")}>Overwrite</button>
        <button type="button" className={mode === "duplicate" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicate")}>Duplicate submit</button>
        <button type="button" className={mode === "hiddenLocal" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenLocal")}>Hidden local</button>
      </div>
      <p className="demo-status">{copy[mode]}</p>
    </div>
  );
}

function ConflictResolutionGoodUx({ meta }: { meta: PatternMeta }) {
  type ResolutionMode = "review" | "local" | "server" | "merge" | "copy" | "skipped" | "summary" | "manual" | "committed";
  const [mode, setMode] = useState<ResolutionMode>("review");
  const [status, setStatus] = useState("Review conflict 1 of 3 before committing the field report.");
  const copy: Record<ResolutionMode, string> = {
    review: "Conflict 1 of 3 is open. No decision has been committed.",
    local: "Local value is selected for Supervisor comment, but the final report is still reviewable.",
    server: "Server value is selected for Emergency contact, while the rejected local value remains recoverable.",
    merge: "Merged value combines both comments and must pass review before commit.",
    copy: "Local Safety note is saved as a copy while the server value remains current.",
    skipped: "Photo attachment is deferred because the browser cannot compare the binary versions.",
    summary: "Decision summary is ready; commit is available only after required conflicts have a decision or manual route.",
    manual: "Unsupported attachment is routed to manual resolution with both versions available.",
    committed: "Resolved value accepted by the server and conflict badge cleared with history retained."
  };
  const currentTitle = mode === "server"
    ? meta.options[1]
    : mode === "copy"
      ? meta.options[2]
      : mode === "manual" || mode === "skipped"
        ? meta.options[3]
        : meta.options[0];
  const unresolved = mode === "committed" ? 0 : mode === "summary" ? 0 : mode === "manual" || mode === "skipped" ? 1 : 2;
  const canCommit = mode === "summary";

  function choose(next: ResolutionMode, message: string) {
    setMode(next);
    setStatus(message);
  }

  function commit() {
    if (!canCommit) {
      setStatus("Commit blocked until required conflicts are reviewed or routed to manual resolution.");
      return;
    }
    choose("committed", `${meta.options[4]} committed with merged comment, server contact, saved copy, and manual attachment route recorded.`);
  }

  function reset() {
    setMode("review");
    setStatus("Review conflict 1 of 3 before committing the field report.");
  }

  return (
    <div className="quality-example conflict-resolution-good-ux">
      <div className="demo-row conflict-resolution-controls">
        <button type="button" className={mode === "review" ? "demo-button small primary" : "demo-button small"} onClick={reset}>Review</button>
        <button type="button" className={mode === "local" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("local", `${meta.options[0]} set to keep the local value; final commit still pending.`)}>Keep local</button>
        <button type="button" className={mode === "server" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("server", `${meta.options[1]} set to keep the server value with local value retained until commit.`)}>Keep server</button>
        <button type="button" className={mode === "merge" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("merge", `${meta.options[0]} merged into a reviewed final value.`)}>Merge both</button>
        <button type="button" className={mode === "copy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copy", `${meta.options[2]} saved as a copy before choosing the server value.`)}>Save copy</button>
        <button type="button" className={mode === "skipped" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("skipped", `${meta.options[3]} skipped and left unresolved for manual handling.`)}>Skip</button>
        <button type="button" className={mode === "manual" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("manual", `${meta.options[3]} needs the desktop comparison tool; both files are available.`)}>Manual file</button>
        <button type="button" className={mode === "summary" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("summary", "Decision summary reviewed; required conflicts have decisions or manual routes.")}>Review decisions</button>
        <button type="button" className="demo-button small" onClick={commit} disabled={!canCommit}>Commit</button>
      </div>

      <div className={`conflict-card ${mode === "committed" ? "resolved" : mode === "manual" || mode === "skipped" ? "warning" : ""}`}>
        <div className="conflict-topline">
          <div>
            <strong>{mode === "summary" ? "Review decisions before commit" : mode === "committed" ? "Conflict resolution committed" : `Resolve: ${currentTitle}`}</strong>
            <span>{copy[mode]}</span>
          </div>
          <span className={`conflict-chip ${mode === "committed" ? "resolved" : mode === "review" ? "review" : mode}`}>{mode === "committed" ? "Committed" : `${unresolved} unresolved`}</span>
        </div>
        <div className="resolution-stepper" aria-label="Resolution progress">
          <span className={mode === "review" ? "is-current" : "is-done"}>{meta.options[0]} - {mode === "review" ? "reviewing" : mode === "merge" || mode === "summary" || mode === "committed" ? "merged" : "decided"}</span>
          <span className={mode === "server" ? "is-current" : mode === "summary" || mode === "committed" ? "is-done" : ""}>{meta.options[1]} - {mode === "server" || mode === "summary" || mode === "committed" ? "server kept" : "waiting"}</span>
          <span className={mode === "manual" || mode === "skipped" ? "is-current" : mode === "summary" || mode === "committed" ? "is-done" : ""}>{meta.options[3]} - {mode === "manual" || mode === "skipped" ? "manual route" : mode === "summary" || mode === "committed" ? "routed" : "waiting"}</span>
        </div>
        {mode === "summary" || mode === "committed" ? (
          <div className="resolution-summary" aria-label="Resolution decision summary">
            <div><span>Merged</span><strong>{meta.options[0]}</strong><small>Both comments retained in the final note.</small></div>
            <div><span>Server kept</span><strong>{meta.options[1]}</strong><small>Local contact copied to history.</small></div>
            <div><span>Manual route</span><strong>{meta.options[3]}</strong><small>Both files attached to {meta.options[4]}.</small></div>
          </div>
        ) : (
          <div className="conflict-version-grid" aria-label="Compared conflict values">
            <div className="conflict-value mine">
              <span>{mode === "manual" || mode === "skipped" ? "Your file - device 11:06" : "Your value - device 11:06"}</span>
              <strong>{mode === "manual" || mode === "skipped" ? "field-photo-edited.jpg" : mode === "server" ? "Call Jordan if pressure rises again." : "Valve pressure rose after restart. Schedule inspection before close."}</strong>
              <small>Local source is preserved until commit.</small>
            </div>
            <div className="conflict-value theirs">
              <span>{mode === "manual" || mode === "skipped" ? "Server file - 11:07" : "Server value by Mina - 11:07"}</span>
              <strong>{mode === "manual" || mode === "skipped" ? "field-photo.jpg" : mode === "server" ? "Call Priya for tomorrow's inspection." : "Valve pressure stable after restart. Inspection can happen tomorrow."}</strong>
              <small>Server source remains available for review.</small>
            </div>
          </div>
        )}
        <div className="conflict-preview">
          <strong>Resolved preview</strong>
          <span>{mode === "merge" || mode === "summary" || mode === "committed" ? "Valve pressure rose after restart, then stabilized. Schedule inspection before close and notify Mina." : mode === "local" ? "Local value will become the field report value." : mode === "server" ? "Server contact will remain and local contact will be copied to history." : mode === "copy" ? "Local safety note will be attached as a copy; server value remains current." : mode === "manual" || mode === "skipped" ? "No browser merge is committed for the attachment." : "Choose a decision to generate a final value."}</span>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function ConflictResolutionBadUx({ meta }: { meta: PatternMeta }) {
  type Misuse = "acceptAll" | "commitOpen" | "ambiguous" | "lostChoices" | "hiddenSkipped" | "serverReject";
  const [mode, setMode] = useState<Misuse>("acceptAll");
  const copy: Record<Misuse, string> = {
    acceptAll: "One bulk action applies recommended values without showing which fields or values are discarded.",
    commitOpen: "Commit is available even though required conflicts are unresolved.",
    ambiguous: "Ours and Theirs are unlabeled, so users cannot tell which value belongs to which source.",
    lostChoices: "Reload loses in-progress resolution choices and returns to the first conflict.",
    hiddenSkipped: "Skipped conflicts disappear from the report with no route back.",
    serverReject: "The server rejects the resolved version, but the UI clears the conflict badge anyway."
  };

  return (
    <div className="quality-example conflict-resolution-bad-ux">
      <div className="demo-row conflict-resolution-controls">
        {(["acceptAll", "commitOpen", "ambiguous", "lostChoices", "hiddenSkipped", "serverReject"] as const).map((item) => (
          <button
            type="button"
            key={item}
            className={mode === item ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item)}
          >
            {item === "acceptAll" ? "Accept all" : item === "commitOpen" ? "Open commit" : item === "ambiguous" ? "Ambiguous sides" : item === "lostChoices" ? "Lost choices" : item === "hiddenSkipped" ? "Hidden skipped" : "Server reject"}
          </button>
        ))}
      </div>
      <div className="conflict-card bad">
        <div className="conflict-topline">
          <div>
            <strong>{mode === "serverReject" ? "Resolution saved" : mode === "commitOpen" ? "Ready to commit" : "Conflict resolver"}</strong>
            <span>{copy[mode]}</span>
          </div>
          <span className="conflict-chip bad">{mode === "commitOpen" ? "2 open" : mode === "serverReject" ? "Cleared" : "Unsafe"}</span>
        </div>
        <div className="resolution-stepper bad" aria-label="Broken resolution progress">
          <span className={mode === "lostChoices" ? "" : "is-done"}>{meta.options[0]} - {mode === "lostChoices" ? "choice lost" : "auto"}</span>
          <span className={mode === "commitOpen" ? "is-current" : ""}>{meta.options[1]} - {mode === "hiddenSkipped" ? "hidden" : "unknown"}</span>
          <span>{meta.options[3]} - {mode === "serverReject" ? "rejected" : "not reviewed"}</span>
        </div>
        <div className="conflict-version-stack">
          <div className="conflict-value muted">
            <span>{mode === "ambiguous" ? "Ours" : "Resolution detail"}</span>
            <strong>{mode === "acceptAll" ? "Recommended values selected" : mode === "serverReject" ? "Server rejected version 18" : "No final reviewed value"}</strong>
            <small>{mode === "ambiguous" ? "No branch, owner, timestamp, local, or server label." : mode === "hiddenSkipped" ? "Skipped items are not linked from the summary." : "Discarded values are unavailable before commit."}</small>
          </div>
        </div>
        <div className="conflict-actions">
          <button type="button" className="demo-button small danger">{mode === "commitOpen" ? "Commit anyway" : mode === "acceptAll" ? "Accept all" : "Continue"}</button>
          <button type="button" className="demo-button small" disabled={mode === "lostChoices" || mode === "hiddenSkipped"}>Review decisions</button>
        </div>
      </div>
      <p className="demo-status">{copy[mode]} {meta.options[4]} has no trustworthy decision record.</p>
    </div>
  );
}

function PermissionRecoveryGoodUx({ meta }: { meta: PatternMeta }) {
  type RecoveryMode = "start" | "role" | "reason" | "sent" | "pending" | "approved" | "declined" | "switch" | "policy" | "resumed";
  const [mode, setMode] = useState<RecoveryMode>("start");
  const [status, setStatus] = useState("Access is blocked; choose a recovery path before retrying the report.");
  const config: Record<RecoveryMode, { chip: string; title: string; detail: string; role: string; next: string; note: string; card: string }> = {
    start: {
      chip: "Blocked",
      title: "Recover access to Quarterly revenue report",
      detail: "Signed in as alex@northwind.example. The original report link is preserved.",
      role: "Analyst member",
      next: meta.options[0],
      note: "Choose a role request, switch account, or open an allowed dashboard.",
      card: ""
    },
    role: {
      chip: "Role",
      title: `Request ${meta.options[0]}`,
      detail: "Viewer access is enough for this report; Editor is not requested because it is not needed.",
      role: meta.options[0],
      next: "Reason required",
      note: "Least-privilege role selection prevents asking for more access than the task needs.",
      card: "warning"
    },
    reason: {
      chip: "Reason",
      title: "Explain why access is needed",
      detail: "Need Q2 renewal forecast before Friday review.",
      role: meta.options[0],
      next: meta.options[2],
      note: "The owner receives account, requested role, report target, and reason.",
      card: "warning"
    },
    sent: {
      chip: "Sent",
      title: `Request ${meta.options[1]} sent`,
      detail: `Sent to ${meta.options[2]} today at 10:16 with requested role and reason.`,
      role: "Request recorded",
      next: "Owner review",
      note: "The request now has an ID and cannot be mistaken for approval.",
      card: "warning"
    },
    pending: {
      chip: "Pending",
      title: `${meta.options[1]} is waiting for owner review`,
      detail: "A duplicate request reopens this status instead of notifying the owner again.",
      role: "Pending owner decision",
      next: "Notify when decided",
      note: "Pending state prevents duplicate requests and keeps fallback work available.",
      card: "warning"
    },
    approved: {
      chip: "Approved",
      title: `${meta.options[0]} approved`,
      detail: "The permission grant is active. The report can now be retried from the same workflow.",
      role: meta.options[0],
      next: meta.options[4],
      note: "Retry is now safe because authorization changed.",
      card: "approved"
    },
    declined: {
      chip: "Declined",
      title: "Access request declined",
      detail: "Finance Ops declined access. Contact your manager or use the allowed dashboard.",
      role: "Not granted",
      next: "Escalate or fallback",
      note: "Decline is not a load failure; repeating retry will not help.",
      card: "bad"
    },
    switch: {
      chip: "Wrong account",
      title: "Another signed-in account already has access",
      detail: "northwind-finance@example.com can open this report. Switching returns here.",
      role: meta.options[3],
      next: "Switch account",
      note: "Wrong-account recovery avoids an unnecessary owner request.",
      card: "warning"
    },
    policy: {
      chip: "Policy",
      title: "Organization policy blocks owner approval",
      detail: "External sharing is disabled for Finance reports. Ask an admin for an exception.",
      role: "Policy block",
      next: "Admin escalation",
      note: "The workflow stops impossible owner requests and routes to policy escalation.",
      card: "bad"
    },
    resumed: {
      chip: "Open",
      title: "Report opened after access changed",
      detail: "The original report link, request history, and approval state remain available.",
      role: meta.options[0],
      next: "Recovered",
      note: "Recovery completes by returning to the blocked task, not by landing on a generic dashboard.",
      card: "approved"
    }
  };
  const current = config[mode];

  function choose(next: RecoveryMode, nextStatus: string) {
    setMode(next);
    setStatus(nextStatus);
  }

  return (
    <div className={`quality-example permission-recovery-good-ux is-${mode}`}>
      <div className="demo-row permission-recovery-controls">
        <button type="button" className={mode === "start" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("start", "Access is blocked; choose a recovery path before retrying the report.")}>Start</button>
        <button type="button" className={mode === "role" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("role", "Finance viewer selected as the least-privilege role for the report.")}>Choose role</button>
        <button type="button" className={mode === "reason" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reason", "Reason captured for the owner with the original report attached.")}>Add reason</button>
        <button type="button" className={mode === "sent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sent", `${meta.options[1]} sent to ${meta.options[2]}; access is still pending.`)}>Send request</button>
        <button type="button" className={mode === "pending" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pending", "Pending request reopened; duplicate owner notification avoided.")}>Pending</button>
        <button type="button" className={mode === "approved" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("approved", "Owner approved access; retry is now allowed.")}>Approved</button>
        <button type="button" className={mode === "declined" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("declined", "Owner declined access; fallback and escalation paths remain.")}>Declined</button>
        <button type="button" className={mode === "switch" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("switch", "Switching account will return to the blocked report.")}>Switch account</button>
        <button type="button" className={mode === "policy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("policy", "Owner request is blocked by policy; route to admin exception.")}>Policy block</button>
        <button type="button" className={mode === "resumed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resumed", "Original report opened after permission recovery completed.")} disabled={mode !== "approved" && mode !== "resumed"}>Retry after grant</button>
      </div>
      <div className={`permission-card ${current.card}`}>
        <div className="permission-topline">
          <div>
            <strong>{current.title}</strong>
            <span>{current.detail}</span>
          </div>
          <span className={`permission-chip ${mode}`}>{current.chip}</span>
        </div>
        <div className="permission-grid">
          <div className="permission-row">
            <span>Current recovery state</span>
            <strong>{current.role}</strong>
            <small>Signed in workspace: Northwind Sales Ops.</small>
          </div>
          <div className="permission-row">
            <span>Next safe action</span>
            <strong>{current.next}</strong>
            <small>{current.note}</small>
          </div>
        </div>
        <div className="permission-recovery-timeline" aria-label="Access recovery progress">
          <span className={mode === "start" || mode === "role" || mode === "reason" ? "is-current" : "is-done"}>Prepare</span>
          <span className={mode === "sent" || mode === "pending" ? "is-current" : mode === "approved" || mode === "declined" || mode === "resumed" ? "is-done" : ""}>Owner review</span>
          <span className={mode === "approved" || mode === "declined" || mode === "policy" ? "is-current" : mode === "resumed" ? "is-done" : ""}>Decision</span>
          <span className={mode === "resumed" ? "is-done" : ""}>Resume task</span>
        </div>
        <div className="permission-request-box">
          <strong>{mode === "pending" ? "Duplicate protection" : mode === "approved" || mode === "resumed" ? "Resume path" : mode === "declined" || mode === "policy" ? "Escalation" : "Request packet"}</strong>
          <span>{mode === "pending" ? `${meta.options[1]} remains pending with ${meta.options[2]}.` : mode === "approved" || mode === "resumed" ? `Return to ${meta.subject} with ${meta.options[0]} granted.` : mode === "declined" ? "Use allowed dashboard or contact manager; do not keep retrying the denied report." : mode === "policy" ? "Owner cannot grant this; send policy exception to Finance admins." : `Requester ${meta.options[3]}, role ${meta.options[0]}, owner ${meta.options[2]}, reason included.`}</span>
        </div>
        <div className="permission-actions">
          <button type="button" className="demo-button small primary" disabled={mode === "declined" || mode === "policy"}>{mode === "approved" || mode === "resumed" ? meta.options[4] : mode === "pending" ? "View request" : "Continue recovery"}</button>
          <button type="button" className="demo-button small">{mode === "switch" ? "Switch now" : mode === "policy" ? "Contact admin" : "Open allowed dashboard"}</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function PermissionRecoveryBadUx({ meta }: { meta: PatternMeta }) {
  type Misuse = "retryLoop" | "falseGrant" | "duplicate" | "hiddenOwner" | "policyLoop" | "leak";
  const [mode, setMode] = useState<Misuse>("retryLoop");
  const copy: Record<Misuse, string> = {
    retryLoop: "Retry repeats the same authorization denial because no role, account, or policy state changed.",
    falseGrant: "Request submission is presented as granted access before any owner decision exists.",
    duplicate: "Reload hides the pending request, so the owner receives duplicate notifications.",
    hiddenOwner: "The user cannot tell who receives the request or what role is being requested.",
    policyLoop: "Owner request is offered even though organization policy prevents that owner from granting access.",
    leak: "Recovery copy exposes a restricted report title and owner to an account that should not know it exists."
  };

  return (
    <div className={`quality-example permission-recovery-bad-ux is-${mode}`}>
      <div className="demo-row permission-recovery-controls">
        {(["retryLoop", "falseGrant", "duplicate", "hiddenOwner", "policyLoop", "leak"] as const).map((item) => (
          <button
            type="button"
            key={item}
            className={mode === item ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item)}
          >
            {item === "retryLoop" ? "Retry loop" : item === "falseGrant" ? "False grant" : item === "duplicate" ? "Duplicate" : item === "hiddenOwner" ? "Hidden owner" : item === "policyLoop" ? "Policy loop" : "Leak details"}
          </button>
        ))}
      </div>
      <div className="permission-card bad">
        <div className="permission-topline">
          <div>
            <strong>{mode === "leak" ? "Project Saffron acquisition model" : mode === "falseGrant" ? "Access granted" : mode === "duplicate" ? "Send request again" : "Permission recovery"}</strong>
            <span>{copy[mode]}</span>
          </div>
          <span className="permission-chip bad">{mode === "falseGrant" ? "Granted" : mode === "policyLoop" ? "Loop" : "Unsafe"}</span>
        </div>
        <div className="permission-grid">
          <div className="permission-row muted">
            <span>{mode === "leak" ? "Restricted detail" : "Request state"}</span>
            <strong>{mode === "duplicate" ? "Pending hidden" : mode === "hiddenOwner" ? "No owner route" : mode === "policyLoop" ? "Impossible owner request" : mode === "falseGrant" ? "No approval" : "Unchanged role"}</strong>
            <small>{mode === "leak" ? "Title and owner appear before access is granted." : mode === "policyLoop" ? "Finance owner cannot override external sharing policy." : mode === "duplicate" ? "Existing request ACC-2048 is not shown." : "No trustworthy request lifecycle is visible."}</small>
          </div>
          <div className="permission-row muted">
            <span>Original task</span>
            <strong>{mode === "falseGrant" ? "Opened too early" : "Return path missing"}</strong>
            <small>{mode === "retryLoop" ? "Retry sends the same denied request." : "Users cannot see when the blocked report can actually resume."}</small>
          </div>
        </div>
        <div className="permission-recovery-timeline bad" aria-label="Broken access recovery progress">
          <span className={mode === "falseGrant" ? "is-done" : ""}>Request</span>
          <span>{mode === "duplicate" ? "lost" : "unknown"}</span>
          <span>{mode === "policyLoop" ? "blocked" : "not decided"}</span>
          <span>{mode === "falseGrant" ? "claimed" : "missing"}</span>
        </div>
        <div className="permission-actions">
          <button type="button" className="demo-button small danger">{mode === "retryLoop" ? "Retry" : mode === "duplicate" ? "Send again" : mode === "falseGrant" ? "Open report" : "Continue"}</button>
          <button type="button" className="demo-button small" disabled={mode === "hiddenOwner" || mode === "policyLoop"}>View request</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]} {meta.subject} recovery is not proven until role, owner, status, and return path are explicit.</p>
    </div>
  );
}

function MergeConflictResolverGoodUx({ meta }: { meta: PatternMeta }) {
  type MergeMode = "review" | "target" | "source" | "edit" | "invalid" | "manual" | "summary" | "committed" | "moved";
  const [mode, setMode] = useState<MergeMode>("review");
  const [status, setStatus] = useState("Review hunk 1 of 2 in src/billing/rules.ts before creating a resolution commit.");
  const copy: Record<MergeMode, string> = {
    review: "Target main and source feature/billing are both preserved while the hunk is open.",
    target: "Target branch code is selected for this hunk; source code remains inspectable until commit.",
    source: "Source branch code is selected for this hunk; target code remains inspectable until commit.",
    edit: "Resolved hunk has been edited to keep the source signature and target fallback behavior.",
    invalid: "Validation found a remaining conflict marker, so commit stays blocked.",
    manual: "package-lock.json is outside browser resolver limits and is routed to local commands.",
    summary: "Resolved files are ready for review with a commit message and manual file route recorded.",
    committed: "Repository accepted the resolution commit and mergeability refreshed.",
    moved: "Target main moved after review, so the browser resolution must be refreshed before commit."
  };
  const unresolved = mode === "committed" ? 0 : mode === "summary" ? 0 : mode === "manual" ? 1 : mode === "invalid" ? 2 : 2;
  const canCommit = mode === "summary";

  function choose(next: MergeMode, message: string) {
    setMode(next);
    setStatus(message);
  }

  function commit() {
    if (!canCommit) {
      setStatus("Commit blocked until hunks validate, unsupported files are routed, and target branch freshness is confirmed.");
      return;
    }
    choose("committed", `${meta.options[4]} created for ${meta.subject}; mergeability refreshed with history retained.`);
  }

  function reset() {
    setMode("review");
    setStatus("Review hunk 1 of 2 in src/billing/rules.ts before creating a resolution commit.");
  }

  return (
    <div className="quality-example merge-conflict-good-ux">
      <div className="demo-row merge-conflict-controls">
        <button type="button" className={mode === "review" ? "demo-button small primary" : "demo-button small"} onClick={reset}>Review hunk</button>
        <button type="button" className={mode === "target" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("target", "Hunk 1 selected target main; source branch code is still available before commit.")}>Use target</button>
        <button type="button" className={mode === "source" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("source", "Hunk 1 selected source feature/billing; target branch code is still available before commit.")}>Use source</button>
        <button type="button" className={mode === "edit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("edit", "Edited hunk validates with both intended behaviors kept.")}>Edit hunk</button>
        <button type="button" className={mode === "invalid" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("invalid", "Remaining conflict marker detected; resolution commit is blocked.")}>Marker error</button>
        <button type="button" className={mode === "manual" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("manual", "Generated lockfile requires local resolution commands before repository commit.")}>Manual file</button>
        <button type="button" className={mode === "moved" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("moved", "Target branch moved; refresh conflict data before committing.")}>Target moved</button>
        <button type="button" className={mode === "summary" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("summary", "Resolved files reviewed; commit message is ready and unsupported file route is recorded.")}>Review commit</button>
        <button type="button" className="demo-button small" onClick={commit} disabled={!canCommit}>Commit</button>
      </div>

      <div className={`conflict-card ${mode === "committed" ? "resolved" : mode === "manual" || mode === "invalid" || mode === "moved" ? "warning" : ""}`}>
        <div className="conflict-topline">
          <div>
            <strong>{mode === "summary" ? "Review resolution commit" : mode === "committed" ? "Merge conflict resolved" : `${meta.subject}: ${meta.options[0]}`}</strong>
            <span>{copy[mode]}</span>
          </div>
          <span className={`conflict-chip ${mode === "committed" ? "resolved" : mode === "review" ? "review" : mode}`}>{mode === "committed" ? "Committed" : `${unresolved} open`}</span>
        </div>

        <div className="merge-file-tabs" aria-label="Merge conflict files">
          <span className={mode === "manual" ? "" : "is-current"}>{meta.options[0]} - {mode === "summary" || mode === "committed" ? "resolved" : mode === "invalid" ? "marker found" : "hunk 1"}</span>
          <span className={mode === "manual" ? "is-current" : ""}>package-lock.json - {mode === "manual" || mode === "summary" || mode === "committed" ? "local route" : "waiting"}</span>
          <span>README.md - auto merged</span>
        </div>

        {mode === "summary" || mode === "committed" ? (
          <div className="merge-commit-grid" aria-label="Resolution commit review">
            <div><span>Branch pair</span><strong>target main {"<-"} source feature/billing</strong></div>
            <div><span>Files</span><strong>{meta.options[0]} resolved; package-lock.json manual route recorded</strong></div>
            <div><span>Commit message</span><strong>Resolve billing rules merge conflict</strong></div>
          </div>
        ) : (
          <div className={`merge-code-panel ${mode === "invalid" ? "bad" : ""}`} aria-label="Current code hunk">
            <code className="merge-code-line target">target main: return calculateDiscount(total) ?? 0;</code>
            <code className="merge-code-line source">source feature/billing: return calculateDiscount(total, region);</code>
            <code className="merge-code-line resolved">{mode === "target" ? "resolved: return calculateDiscount(total) ?? 0;" : mode === "source" ? "resolved: return calculateDiscount(total, region);" : mode === "edit" ? "resolved: return calculateDiscount(total, region) ?? 0;" : mode === "invalid" ? "resolved: <<<<<<< main" : mode === "manual" ? "manual: run git checkout --ours package-lock.json or resolve locally" : mode === "moved" ? "blocked: target main changed after this hunk loaded" : "open: choose target, source, or edit resolved hunk"}</code>
          </div>
        )}

        <div className="conflict-preview">
          <strong>{mode === "invalid" ? "Validation" : mode === "manual" ? "Manual route" : mode === "moved" ? "Freshness check" : "Commit boundary"}</strong>
          <span>{mode === "invalid" ? "Commit is disabled until conflict markers are removed." : mode === "manual" ? "The generated file remains unresolved in the repository until local commands are pushed." : mode === "moved" ? "The resolver must reload target main before the commit can be trusted." : mode === "summary" || mode === "committed" ? "Files, branch pair, and commit message were reviewed before creating the resolution commit." : "The repository will not be updated until all hunks validate and the commit message is reviewed."}</span>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function MergeConflictResolverBadUx({ meta }: { meta: PatternMeta }) {
  type Misuse = "bulkIncoming" | "undefinedSides" | "markersCommit" | "binaryEdit" | "lostHunks" | "serverReject";
  const [mode, setMode] = useState<Misuse>("bulkIncoming");
  const copy: Record<Misuse, string> = {
    bulkIncoming: "Accept all incoming applies code across files without branch meaning or discarded-code review.",
    undefinedSides: "Ours and Theirs appear without target/source branch definitions.",
    markersCommit: "Commit is enabled while conflict markers remain in the resolved file.",
    binaryEdit: "A binary file is forced into a text conflict editor.",
    lostHunks: "Resolved hunk choices disappear after reload and the resolver returns to the first file.",
    serverReject: "The repository rejects the resolution commit, but the UI clears the merge conflict badge."
  };

  return (
    <div className="quality-example merge-conflict-bad-ux">
      <div className="demo-row merge-conflict-controls">
        {(["bulkIncoming", "undefinedSides", "markersCommit", "binaryEdit", "lostHunks", "serverReject"] as const).map((item) => (
          <button
            type="button"
            key={item}
            className={mode === item ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item)}
          >
            {item === "bulkIncoming" ? "Accept incoming" : item === "undefinedSides" ? "Undefined sides" : item === "markersCommit" ? "Marker commit" : item === "binaryEdit" ? "Binary text" : item === "lostHunks" ? "Lost hunks" : "Server reject"}
          </button>
        ))}
      </div>
      <div className="conflict-card bad">
        <div className="conflict-topline">
          <div>
            <strong>{mode === "serverReject" ? "Conflicts fixed" : mode === "markersCommit" ? "Ready to commit" : "Merge resolver"}</strong>
            <span>{copy[mode]}</span>
          </div>
          <span className="conflict-chip bad">{mode === "serverReject" ? "Cleared" : "Unsafe"}</span>
        </div>
        <div className="merge-file-tabs bad" aria-label="Broken merge files">
          <span>{meta.options[0]} - {mode === "lostHunks" ? "choice lost" : "auto"}</span>
          <span>package-lock.json - {mode === "binaryEdit" ? "text edit" : "unknown"}</span>
          <span>branch pair - {mode === "undefinedSides" ? "ours/theirs" : "hidden"}</span>
        </div>
        <div className="merge-code-panel bad" aria-label="Broken code hunk">
          <code>{mode === "undefinedSides" ? "Ours: return calculateDiscount(total);" : "incoming: return calculateDiscount(total, region);"}</code>
          <code>{mode === "markersCommit" ? "<<<<<<< main" : mode === "binaryEdit" ? "PNG IHDR ... unreadable bytes" : mode === "serverReject" ? "server: target branch moved" : "discarded code not shown"}</code>
          <code>{mode === "markersCommit" ? ">>>>>>> feature/billing" : "commit preview unavailable"}</code>
        </div>
        <div className="conflict-actions">
          <button type="button" className="demo-button small danger">{mode === "markersCommit" ? "Commit anyway" : mode === "bulkIncoming" ? "Accept incoming" : "Continue"}</button>
          <button type="button" className="demo-button small" disabled={mode === "lostHunks" || mode === "serverReject"}>Review files</button>
        </div>
      </div>
      <p className="demo-status">{copy[mode]} {meta.subject} has no reliable branch, hunk, validation, or commit record.</p>
    </div>
  );
}

function GracefulDegradationGoodUx({ meta }: { meta: PatternMeta }) {
  type DegradationMode = "enhanced" | "calendar" | "map" | "dragdrop" | "lowMotion" | "thirdParty" | "restored" | "noCore";
  const [mode, setMode] = useState<DegradationMode>("enhanced");
  const [date, setDate] = useState("2026-07-14");
  const [location, setLocation] = useState("North clinic");
  const [status, setStatus] = useState("Enhanced calendar, map, drag/drop, and reminder widget are available.");
  const copy: Record<DegradationMode, string> = {
    enhanced: "Enhanced controls are active, but baseline date fields, location list, and file input remain the canonical path.",
    calendar: "Calendar script failed. Date fields keep the booking task available without leaving the page.",
    map: "Map view is unavailable. The sorted location list still supports choosing a clinic.",
    dragdrop: "Drag/drop upload is unsupported. The standard file picker remains available.",
    lowMotion: "Heavy animation and preview media are reduced. Content and actions remain in the same order.",
    thirdParty: "Reminder widget is degraded by a third-party outage. Booking still submits without optional reminders.",
    restored: "Enhancement restored after the baseline fields kept the typed date and selected location.",
    noCore: "This capability is required for the task. The page saves work and explains the accountable handoff."
  };

  function chooseMode(nextMode: DegradationMode, nextStatus: string) {
    setMode(nextMode);
    setStatus(nextStatus);
  }

  function restore() {
    chooseMode("restored", `Enhanced layer restored; ${date} and ${location} stayed in the baseline controls.`);
  }

  function reset() {
    setMode("enhanced");
    setDate("2026-07-14");
    setLocation("North clinic");
    setStatus("Enhanced calendar, map, drag/drop, and reminder widget are available.");
  }

  return (
    <div className="quality-example graceful-degradation-demo">
      <div className={`degradation-card is-${mode}`}>
        <strong>{mode === "enhanced" ? "Enhanced booking available" : mode === "restored" ? "Enhancement restored" : mode === "noCore" ? "Secure check required" : "Reduced-capability booking"}</strong>
        <span>{copy[mode]}</span>
        <span>{meta.options[3]} stays attached to this booking.</span>
      </div>

      <div className="degradation-status-grid" aria-label="Capability status">
        <span className={mode === "calendar" ? "is-degraded" : "is-ready"}>{mode === "calendar" ? "Calendar failed" : meta.options[0]}</span>
        <span className={mode === "map" ? "is-degraded" : "is-ready"}>{mode === "map" ? "Map unavailable" : meta.options[2]}</span>
        <span className={mode === "dragdrop" ? "is-degraded" : "is-ready"}>{mode === "dragdrop" ? "File picker active" : "Drag/drop enhanced"}</span>
        <span className={mode === "thirdParty" ? "is-degraded" : "is-ready"}>{mode === "thirdParty" ? "Reminder optional" : "Reminder widget"}</span>
      </div>

      <div className="degradation-core-form">
        <label>
          <span>Appointment date</span>
          <input
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setStatus(`Date updated through baseline fields: ${event.target.value || "empty"}.`);
            }}
            aria-describedby="degradation-date-hint"
          />
          <small id="degradation-date-hint">Use YYYY-MM-DD. Calendar is only an enhancement.</small>
        </label>
        <label>
          <span>Location</span>
          <select
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setStatus(`Location selected from baseline list: ${event.target.value}.`);
            }}
          >
            <option>North clinic</option>
            <option>East clinic</option>
            <option>Telephone appointment</option>
          </select>
        </label>
        <label>
          <span>Evidence upload</span>
          <button type="button" className="demo-button small">Choose file</button>
          <small>{mode === "dragdrop" ? "Drag/drop unavailable; file input route remains." : "Drag/drop can enhance this file input."}</small>
        </label>
        <div className="degradation-note">
          <strong>{mode === "noCore" ? "Cannot complete here" : "Core path available"}</strong>
          <span>{mode === "noCore" ? "Identity video check is required by policy. The booking is saved and support can resume from the reference." : `Continue submits ${date || "the entered date"} at ${location}.`}</span>
        </div>
      </div>

      <div className="demo-row degradation-controls">
        <button type="button" className={mode === "calendar" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("calendar", "Calendar failed; date fields are active and Continue remains available.")}>Calendar failed</button>
        <button type="button" className={mode === "map" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("map", "Map failed; the location list and selected clinic remain usable.")}>Map failed</button>
        <button type="button" className={mode === "dragdrop" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("dragdrop", "Drag/drop unsupported; standard file picker is ready.")}>Drag/drop failed</button>
        <button type="button" className={mode === "lowMotion" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("lowMotion", "Animation and heavy preview were reduced without changing the task order.")}>Reduce motion</button>
        <button type="button" className={mode === "thirdParty" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("thirdParty", "Reminder widget is down; booking can continue without optional reminders.")}>Third-party down</button>
        <button type="button" className="demo-button small" onClick={restore}>Restore enhanced</button>
        <button type="button" className={mode === "noCore" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("noCore", "No same-surface core path exists; booking draft saved under the reference.")}>No core path</button>
        <button type="button" className="demo-button small" onClick={reset}>Reset</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function GracefulDegradationBadUx({ meta }: { meta: PatternMeta }) {
  type DegradationMisuse = "blankWidget" | "featureOnly" | "blockedSubmit" | "hiddenCore" | "fakeSuccess" | "upgradeOnly";
  const [mode, setMode] = useState<DegradationMisuse>("blankWidget");
  const copy: Record<DegradationMisuse, string> = {
    blankWidget: "The enhancement failed and the task surface becomes an empty widget.",
    featureOnly: "The design requires camera, geolocation, or drag/drop even though text and file inputs would work.",
    blockedSubmit: "Valid baseline fields exist, but Continue is disabled because the enhanced script did not run.",
    hiddenCore: "Plain controls exist in the page but are visually hidden after enhancement fails.",
    fakeSuccess: "The degraded route submits without required data and still claims the booking succeeded.",
    upgradeOnly: "The page tells users to upgrade or enable features without preserving work or naming a route."
  };

  return (
    <div className="quality-example graceful-degradation-bad-ux">
      <div className={`degradation-card bad is-${mode}`}>
        <strong>{mode === "upgradeOnly" ? "Unsupported browser" : mode === "fakeSuccess" ? "Booked" : mode === "featureOnly" ? "Use camera to continue" : "Calendar loading"}</strong>
        <span>{mode === "blankWidget" ? "" : mode === "blockedSubmit" ? "Select a date in the calendar first." : mode === "hiddenCore" ? "Form controls moved off screen." : mode === "fakeSuccess" ? "Confirmation sent, but location was never captured." : mode === "upgradeOnly" ? "Enable JavaScript or come back later." : "Scan your location to book."}</span>
        <button type="button" className="demo-button small danger" disabled={mode === "blockedSubmit"}>{mode === "blockedSubmit" ? "Continue" : mode === "fakeSuccess" ? "View booking" : "Continue"}</button>
      </div>
      <div className="degradation-note bad">
        <strong>{mode === "fakeSuccess" ? "False completion" : mode === "blockedSubmit" ? "Enhancement dependency" : "Core path broken"}</strong>
        <span>{copy[mode]} {meta.options[3]} is not protected by a reduced-capability contract.</span>
      </div>
      <div className="demo-row degradation-controls">
        <button type="button" className={mode === "blankWidget" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blankWidget")}>Blank widget</button>
        <button type="button" className={mode === "featureOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("featureOnly")}>Feature-only</button>
        <button type="button" className={mode === "blockedSubmit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blockedSubmit")}>Blocked submit</button>
        <button type="button" className={mode === "hiddenCore" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenCore")}>Hidden core</button>
        <button type="button" className={mode === "fakeSuccess" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fakeSuccess")}>Fake success</button>
        <button type="button" className={mode === "upgradeOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("upgradeOnly")}>Upgrade only</button>
      </div>
      <p className="demo-status">{copy[mode]}</p>
    </div>
  );
}

function FallbackPathGoodUx({ meta }: { meta: PatternMeta }) {
  type FallbackMode = "blocked" | "manual" | "assisted" | "completed" | "returned" | "none";
  const [mode, setMode] = useState<FallbackMode>("blocked");
  const [manualLine, setManualLine] = useState("18B Riverside Mews");
  const [status, setStatus] = useState("Lookup found no matching address. Manual and assisted routes are available.");
  const copy: Record<FallbackMode, string> = {
    blocked: "Primary address lookup is blocked by a missing record, but the application reference and postcode are retained.",
    manual: "Manual entry is now active. The postcode and reference carried over from the lookup.",
    assisted: "Support route is ready with the same reference, contact options, hours, and information needed.",
    completed: "Manual fallback completed the same application step and moves the user to review.",
    returned: "The user returned to lookup without losing the manually typed address.",
    none: "No alternate route is available for this step; the safest next step is saved with support reference."
  };

  function selectManual() {
    setMode("manual");
    setStatus(`${meta.options[1]} selected. ${meta.options[0]} and ${meta.options[3]} are retained.`);
  }

  function selectAssisted() {
    setMode("assisted");
    setStatus(`${meta.options[2]} selected with ${meta.options[3]}; phone and webchat know which application to continue.`);
  }

  function completeFallback() {
    setMode("completed");
    setStatus(`${manualLine} accepted through manual entry; continue to review with ${meta.options[3]}.`);
  }

  function returnPrimary() {
    setMode("returned");
    setStatus(`Returned to lookup. ${manualLine || "Manual address draft"} remains saved in the fallback panel.`);
  }

  function reset() {
    setMode("blocked");
    setManualLine("18B Riverside Mews");
    setStatus("Lookup found no matching address. Manual and assisted routes are available.");
  }

  return (
    <div className="quality-example fallback-path-demo">
      <div className={`fallback-path-card is-${mode}`}>
        <strong>{mode === "completed" ? "Fallback completed" : mode === "assisted" ? "Assisted route ready" : mode === "manual" ? "Manual address entry" : mode === "none" ? "No fallback available" : "Address lookup blocked"}</strong>
        <span>{copy[mode]}</span>
        <span>{meta.options[0]} - {meta.options[3]}</span>
      </div>
      <div className="fallback-path-grid">
        <label className="fallback-path-field">
          <span>Address line carried into fallback</span>
          <input value={manualLine} onChange={(event) => setManualLine(event.target.value)} disabled={mode === "blocked" || mode === "assisted" || mode === "none"} />
        </label>
        <div className="fallback-path-note">
          <strong>Tradeoff</strong>
          <span>{mode === "manual" ? "Manual review may take 2 working days." : mode === "assisted" ? "Support is available 9:00-17:00 and uses the same reference." : mode === "completed" ? "The same application outcome is still available." : mode === "none" ? "The service saves progress and explains why there is no alternate route." : "Switching paths will not clear entered details."}</span>
        </div>
      </div>
      <div className="demo-row fallback-path-controls">
        <button type="button" className="demo-button small primary" onClick={selectManual}>Manual entry</button>
        <button type="button" className="demo-button small" onClick={selectAssisted}>Assisted route</button>
        <button type="button" className="demo-button small" onClick={completeFallback} disabled={mode !== "manual" && mode !== "returned"}>Complete fallback</button>
        <button type="button" className="demo-button small" onClick={returnPrimary} disabled={mode !== "manual"}>Return to lookup</button>
        <button type="button" className="demo-button small" onClick={() => { setMode("none"); setStatus(`No fallback exists for this step; progress is saved under ${meta.options[3]}.`); }}>No fallback</button>
        <button type="button" className="demo-button small" onClick={reset}>Reset</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function FallbackPathBadUx({ meta }: { meta: PatternMeta }) {
  type FallbackMisuse = "deadEnd" | "retryLoop" | "hiddenManual" | "dataLoss" | "noReference" | "falsePath";
  const [mode, setMode] = useState<FallbackMisuse>("deadEnd");
  const copy: Record<FallbackMisuse, string> = {
    deadEnd: "The lookup fails and gives no alternate route even though manual entry is available.",
    retryLoop: "Search again repeats the same failed lookup without changing method or input.",
    hiddenManual: "Manual entry exists but is buried in help text after repeated failure.",
    dataLoss: "Switching paths clears the postcode, uploaded proof, and application reference.",
    noReference: "Phone support is offered without the reference or information needed to continue.",
    falsePath: "A PDF link is called a fallback but cannot be submitted, tracked, or tied to the application."
  };

  return (
    <div className="quality-example fallback-path-bad-ux">
      <div className={`fallback-path-card bad is-${mode}`}>
        <strong>{mode === "falsePath" ? "Download form" : mode === "noReference" ? "Call support" : "No matches"}</strong>
        <span>{mode === "dataLoss" ? "Start a new application to continue." : mode === "hiddenManual" ? "Read help article for more options." : mode === "retryLoop" ? "Try the same postcode again." : mode === "falsePath" ? "Print this form and work out where to send it." : mode === "noReference" ? "Tell us what happened." : "Nothing found."}</span>
        <div className="fallback-path-actions">
          <button type="button" className="demo-button small danger">{mode === "retryLoop" ? "Search again" : mode === "falsePath" ? "Download PDF" : "Continue"}</button>
        </div>
      </div>
      <div className="fallback-path-note bad">
        <strong>{mode === "retryLoop" ? "Not a fallback" : mode === "dataLoss" ? "Lost context" : "Route broken"}</strong>
        <span>{copy[mode]}</span>
      </div>
      <div className="demo-row fallback-path-controls">
        <button type="button" className={mode === "deadEnd" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deadEnd")}>Dead end</button>
        <button type="button" className={mode === "retryLoop" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("retryLoop")}>Retry loop</button>
        <button type="button" className={mode === "hiddenManual" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenManual")}>Hidden manual</button>
        <button type="button" className={mode === "dataLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dataLoss")}>Data loss</button>
        <button type="button" className={mode === "noReference" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noReference")}>No reference</button>
        <button type="button" className={mode === "falsePath" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("falsePath")}>False path</button>
      </div>
      <p className="demo-status">{copy[mode]} {meta.options[3]} is not carried through.</p>
    </div>
  );
}

function RetryGoodUx({ meta }: { meta: PatternMeta }) {
  type RetryMode = "failed" | "retrying" | "failedAgain" | "cooldown" | "succeeded" | "nonRetryable" | "exhausted";
  const [mode, setMode] = useState<RetryMode>("failed");
  const [attempt, setAttempt] = useState(1);
  const [status, setStatus] = useState(`${meta.options[0]} failed. Retry is ready for the same request.`);
  const requestId = meta.options[3];
  const copy: Record<RetryMode, string> = {
    failed: "Network timeout after preserving saved filters and export format.",
    retrying: "Sending the same export request; duplicate Retry and Submit controls are disabled.",
    failedAgain: "Attempt failed again. The next retry waits before sending another request.",
    cooldown: "Retry is paused for 18 seconds to protect the service and avoid repeated failures.",
    succeeded: "Export recovered. The download is ready and the failed state is resolved.",
    nonRetryable: "Permission changed. Repeating the request will not work until access is restored.",
    exhausted: "Three attempts failed. Use cached export, run in background, or contact support with the reference."
  };

  function retrySameRequest() {
    if (mode === "retrying" || mode === "succeeded" || mode === "nonRetryable" || mode === "exhausted") return;
    const nextAttempt = Math.min(attempt + 1, 3);
    setAttempt(nextAttempt);
    setMode("retrying");
    setStatus(`Attempt ${nextAttempt} sending ${requestId} with the same filters and idempotency key.`);
  }

  function failAgain() {
    const nextAttempt = Math.min(Math.max(attempt, 2), 3);
    setAttempt(nextAttempt);
    setMode(nextAttempt >= 3 ? "exhausted" : "failedAgain");
    setStatus(nextAttempt >= 3 ? `Attempt ${nextAttempt} failed; retry limit reached for ${requestId}.` : `Attempt ${nextAttempt} failed again; cooldown is now available.`);
  }

  function reset() {
    setAttempt(1);
    setMode("failed");
    setStatus(`${meta.options[0]} failed. Retry is ready for the same request.`);
  }

  return (
    <div className="quality-example retry-demo">
      <div className={`retry-request-card is-${mode}`}>
        <strong>{mode === "succeeded" ? "Export ready" : mode === "nonRetryable" ? "Retry unavailable" : "Export CSV failed"}</strong>
        <span>{meta.options[0]} - {requestId} - filters: Region APAC, Q2, Risk</span>
        <span>{copy[mode]}</span>
      </div>
      <div className="retry-status-grid">
        <div className="retry-state-note">
          <strong>Attempt</strong>
          <span>{attempt} of 3</span>
        </div>
        <div className="retry-state-note">
          <strong>Request key</strong>
          <span>IDEMP-EXP-2048</span>
        </div>
        <div className="retry-state-note">
          <strong>Next action</strong>
          <span>{mode === "cooldown" ? "Wait 18 seconds" : mode === "exhausted" ? "Fallback or support" : mode === "nonRetryable" ? "Request access" : mode === "succeeded" ? "Download CSV" : "Retry same request"}</span>
        </div>
      </div>
      <div className="demo-row retry-controls">
        <button type="button" className="demo-button small primary" onClick={retrySameRequest} disabled={mode === "retrying" || mode === "succeeded" || mode === "nonRetryable" || mode === "exhausted"}>Retry same request</button>
        <button type="button" className="demo-button small" onClick={failAgain} disabled={mode !== "retrying"}>Fail again</button>
        <button type="button" className="demo-button small" onClick={() => { setMode("cooldown"); setStatus(`Cooldown set for ${requestId}; Retry remains scoped to the same export.`); }} disabled={mode === "succeeded" || mode === "nonRetryable" || mode === "exhausted"}>Cooldown</button>
        <button type="button" className="demo-button small" onClick={() => { setMode("succeeded"); setStatus(`${requestId} recovered. Download is ready.`); }}>Succeed</button>
        <button type="button" className="demo-button small" onClick={() => { setMode("nonRetryable"); setStatus("Permission changed; Retry is replaced by Request access."); }}>Non-retryable</button>
        <button type="button" className="demo-button small" onClick={() => { setAttempt(3); setMode("exhausted"); setStatus(`Three attempts failed for ${requestId}; fallback and support paths are visible.`); }}>Exhaust</button>
        <button type="button" className="demo-button small" onClick={reset}>Reset</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function RetryBadUx({ meta }: { meta: PatternMeta }) {
  type RetryMisuse = "duplicate" | "wrongScope" | "infinite" | "nonRetryable" | "hiddenContext" | "autoLoop";
  const [mode, setMode] = useState<RetryMisuse>("duplicate");
  const copy: Record<RetryMisuse, string> = {
    duplicate: "Retry and Submit again are both active, so the same export can be queued twice.",
    wrongScope: "Retry silently changes the export from APAC Q2 to all regions.",
    infinite: "The interface keeps retrying with no cap, cooldown, or fallback path.",
    nonRetryable: "A permission denial is presented as retryable instead of routing to access recovery.",
    hiddenContext: "The failed file, filters, request reference, and attempt count are missing.",
    autoLoop: "Automatic retries run every second during an outage and increase load."
  };

  return (
    <div className="quality-example retry-bad-ux">
      <div className={`retry-request-card bad is-${mode}`}>
        <strong>{mode === "nonRetryable" ? "Access denied" : "Export failed"}</strong>
        <span>{mode === "wrongScope" ? "Scope changed to all regions" : mode === "hiddenContext" ? "Try again" : `${meta.options[0]} - no safe retry contract`}</span>
        <div className="retry-bad-actions">
          <button type="button" className="demo-button small danger">{mode === "autoLoop" ? "Auto retrying" : "Retry"}</button>
          <button type="button" className="demo-button small">Submit again</button>
        </div>
      </div>
      <div className="retry-state-note bad">
        <strong>{mode === "infinite" || mode === "autoLoop" ? "Retry amplification" : mode === "wrongScope" ? "Wrong scope" : "Unsafe retry"}</strong>
        <span>{copy[mode]}</span>
      </div>
      <div className="demo-row retry-controls">
        <button type="button" className={mode === "duplicate" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicate")}>Duplicate submit</button>
        <button type="button" className={mode === "wrongScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongScope")}>Wrong scope</button>
        <button type="button" className={mode === "infinite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("infinite")}>Infinite retry</button>
        <button type="button" className={mode === "nonRetryable" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("nonRetryable")}>Non-retryable</button>
        <button type="button" className={mode === "hiddenContext" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenContext")}>Hidden context</button>
        <button type="button" className={mode === "autoLoop" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("autoLoop")}>Auto loop</button>
      </div>
      <p className="demo-status">{copy[mode]}</p>
    </div>
  );
}

function RestoreTrashGoodUx({ meta }: { meta: PatternMeta }) {
  type TrashItem = {
    id: string;
    name: string;
    type: string;
    path: string;
    deletedBy: string;
    daysLeft: number;
    state: "ready" | "missing-parent" | "conflict" | "expired";
  };
  const initialItems: TrashItem[] = [
    { id: "budget", name: meta.options[0], type: "Spreadsheet", path: "Finance / Q2", deletedBy: "Maya", daysLeft: 29, state: "ready" },
    { id: "exports", name: meta.options[1], type: "Folder", path: "Customers / 2025", deletedBy: "Aditi", daysLeft: 12, state: "missing-parent" },
    { id: "roadmap", name: meta.options[2], type: "Document", path: "Product / Planning", deletedBy: "Sam", daysLeft: 1, state: "expired" },
    { id: "archive", name: meta.options[3], type: "Zip", path: "Imports / Old", deletedBy: "Maya", daysLeft: 8, state: "conflict" }
  ];
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(initialItems[0].id);
  const [status, setStatus] = useState("Select a deleted item and inspect restore context.");
  const [restored, setRestored] = useState<string[]>([]);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  function restoreSelected(target: "original" | "new-location") {
    if (!selected) return;
    if (selected.state === "expired") {
      setStatus(`${selected.name} is past retention and cannot be restored.`);
      return;
    }
    if (selected.state === "missing-parent" && target === "original") {
      setStatus(`${selected.name} needs a new destination because ${selected.path} no longer exists.`);
      return;
    }
    if (selected.state === "conflict" && target === "original") {
      setStatus(`${selected.name} has a name conflict in ${selected.path}; choose a location or rename before restore.`);
      return;
    }
    const restoredTo = target === "original" ? selected.path : "Recovered items";
    setItems((current) => current.filter((item) => item.id !== selected.id));
    setRestored((current) => [`${selected.name} restored to ${restoredTo}`, ...current].slice(0, 3));
    setStatus(`${selected.name} restored to ${restoredTo}.`);
  }

  function bulkReview() {
    setStatus("Bulk review: 1 restores to original, 2 need a destination or conflict fix, 1 is expired and skipped.");
  }

  function reset() {
    setItems(initialItems);
    setSelectedId(initialItems[0].id);
    setRestored([]);
    setStatus("Trash restored to demo starting state.");
  }

  return (
    <div className="quality-example trash-demo">
      <div className="trash-toolbar" aria-label="Trash recovery controls">
        <button type="button" className="demo-button small primary" onClick={() => restoreSelected("original")} disabled={!selected}>Restore original</button>
        <button type="button" className="demo-button small" onClick={() => restoreSelected("new-location")} disabled={!selected}>Choose new location</button>
        <button type="button" className="demo-button small" onClick={bulkReview}>Bulk review</button>
        <button type="button" className="demo-button small" onClick={reset}>Reset</button>
      </div>
      <div className="trash-list" role="list" aria-label={`${meta.subject} with restore metadata`}>
        {items.map((item) => (
          <button
            type="button"
            className={item.id === selectedId ? "trash-item is-selected" : "trash-item"}
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setStatus(`${item.name} selected from ${item.path}.`);
            }}
          >
            <span>
              <strong>{item.name}</strong>
              <small>{item.type} - {item.path}</small>
            </span>
            <span>
              <em>{item.daysLeft} days left</em>
              <small>Deleted by {item.deletedBy}</small>
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <div className={`trash-restore-note is-${selected.state}`} role="status">
          <strong>{selected.name}</strong>
          <span>{selected.state === "ready" ? `Ready to restore to ${selected.path}.` : selected.state === "missing-parent" ? "Original parent is missing; choose a new location." : selected.state === "conflict" ? "Original location contains a name conflict; resolve before restore." : "Retention expires today; restore is blocked after purge."}</span>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{status}</p>
      {restored.length > 0 && (
        <ol className="state-history trash-history" aria-label="Restored item history">
          {restored.map((entry) => <li key={entry}>{entry}</li>)}
        </ol>
      )}
    </div>
  );
}

function RestoreTrashBadUx({ meta }: { meta: PatternMeta }) {
  type TrashMisuse = "noMetadata" | "hiddenLocation" | "adjacentPurge" | "expiredPromise" | "bulkSilent" | "permissionHidden";
  const [mode, setMode] = useState<TrashMisuse>("noMetadata");
  const copy: Record<TrashMisuse, string> = {
    noMetadata: "The deleted item has no type, path, deletion date, actor, or deadline, so users guess which object to restore.",
    hiddenLocation: "Restore sends the item to a hidden or missing parent without explaining where it went.",
    adjacentPurge: "Delete forever sits beside Restore with equal weight and no final-loss review.",
    expiredPromise: "The UI promises recovery after the retention window has already expired.",
    bulkSilent: "Bulk restore reports success while hiding conflicts, skipped items, and missing parents.",
    permissionHidden: "Restore fails because access changed, but the interface never explains the permission boundary."
  };

  return (
    <div className="quality-example trash-bad-ux">
      <div className={`trash-row bad is-${mode}`}>
        <span>
          <strong>{mode === "noMetadata" ? "File 1" : meta.options[0]}</strong>
          <small>{mode === "hiddenLocation" ? "Restored somewhere" : mode === "expiredPromise" ? "Recoverable" : mode === "permissionHidden" ? "Access unknown" : "No recovery context"}</small>
        </span>
        <button type="button" className="demo-button small">Restore</button>
        <button type="button" className="demo-button small danger">Delete forever</button>
      </div>
      <div className="trash-restore-note bad">
        <strong>{mode === "adjacentPurge" ? "Final loss risk" : mode === "bulkSilent" ? "Silent bulk outcome" : "Recovery unclear"}</strong>
        <span>{copy[mode]}</span>
      </div>
      <div className="demo-row trash-mode-controls">
        <button type="button" className={mode === "noMetadata" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noMetadata")}>No metadata</button>
        <button type="button" className={mode === "hiddenLocation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenLocation")}>Hidden location</button>
        <button type="button" className={mode === "adjacentPurge" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("adjacentPurge")}>Adjacent purge</button>
        <button type="button" className={mode === "expiredPromise" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("expiredPromise")}>Expired promise</button>
        <button type="button" className={mode === "bulkSilent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("bulkSilent")}>Silent bulk</button>
        <button type="button" className={mode === "permissionHidden" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("permissionHidden")}>Hidden permission</button>
      </div>
      <p className="demo-status">{copy[mode]}</p>
    </div>
  );
}

function RedoGoodUx({ meta }: { meta: PatternMeta }) {
  const original = meta.options;
  const moved = [meta.options[0], meta.options[2], meta.options[1], meta.options[3]];
  const [items, setItems] = useState(original);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [status, setStatus] = useState("No redo available until an undo happens.");

  function moveHeading() {
    setItems(moved);
    setUndoStack([`Move ${meta.options[2]} before ${meta.options[1]}`]);
    setRedoStack([]);
    setStatus(`${meta.options[2]} moved; undo available.`);
  }

  function undoMove() {
    if (!undoStack.length) {
      setStatus("Nothing to undo, so redo stays unavailable.");
      return;
    }
    const operation = undoStack[0];
    setItems(original);
    setUndoStack([]);
    setRedoStack([operation]);
    setStatus(`Undone: ${operation}. Redo is now available.`);
  }

  function redoMove() {
    if (!redoStack.length) {
      setStatus("Redo unavailable because there is no undone operation.");
      return;
    }
    const operation = redoStack[0];
    setItems(moved);
    setRedoStack([]);
    setUndoStack([operation]);
    setStatus(`Redone: ${operation}.`);
  }

  function newEdit() {
    setItems((current) => current.includes("Editorial note") ? current : [...current, "Editorial note"]);
    setRedoStack([]);
    setUndoStack(["Add Editorial note"]);
    setStatus("New edit made; redo branch cleared.");
  }

  function reset() {
    setItems(original);
    setUndoStack([]);
    setRedoStack([]);
    setStatus("Reset to the starting outline. No redo available.");
  }

  return (
    <div className="quality-example redo-demo">
      <div className="redo-toolbar" aria-label="Redo demo history controls">
        <button type="button" className="demo-button small" onClick={moveHeading}>Move heading</button>
        <button type="button" className="demo-button small" onClick={undoMove} disabled={!undoStack.length}>Undo move</button>
        <button type="button" className="demo-button small primary" onClick={redoMove} disabled={!redoStack.length}>Redo move</button>
        <button type="button" className="demo-button small" onClick={newEdit}>New edit</button>
        <button type="button" className="demo-button small" onClick={reset}>Reset</button>
      </div>
      <ol className="redo-document" aria-label={`${meta.subject} order`}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ol>
      <div className="redo-history-grid">
        <div className="redo-stack-panel">
          <strong>Undo stack</strong>
          <span>{undoStack[0] ?? "No reversible edit"}</span>
        </div>
        <div className={redoStack.length ? "redo-stack-panel is-ready" : "redo-stack-panel"}>
          <strong>Redo stack</strong>
          <span>{redoStack[0] ?? "No undone operation"}</span>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function RedoBadUx({ meta }: { meta: PatternMeta }) {
  type RedoMisuse = "missing" | "stale" | "wrongTarget" | "hiddenStack" | "destructive" | "keyboardOnly";
  const [mode, setMode] = useState<RedoMisuse>("missing");
  const copy: Record<RedoMisuse, string> = {
    missing: "The user undid a move, but the interface offers no visible way to reapply it.",
    stale: "Redo stays enabled after a new edit, so an old future branch can overwrite current work.",
    wrongTarget: "Redo follows the current selection instead of the original heading target.",
    hiddenStack: "The button label says Redo, but no stack or operation explains what will happen.",
    destructive: "Redo repeats a side effect outside the document boundary.",
    keyboardOnly: "Redo exists only as a shortcut, with no visible command for other users."
  };
  const toolbarLabel = mode === "keyboardOnly" ? "Ctrl+Y only" : mode === "hiddenStack" ? "Redo" : "Redo move";

  return (
    <div className="quality-example redo-bad-ux">
      <div className="redo-toolbar bad" aria-label="Problematic redo controls">
        <button type="button" className="demo-button small">Undo</button>
        <button type="button" className={mode === "missing" ? "demo-button small is-hidden" : "demo-button small danger"}>
          {toolbarLabel}
        </button>
      </div>
      <ol className="redo-document bad" aria-label={`${meta.subject} with redo problem`}>
        <li>{meta.options[0]}</li>
        <li>{mode === "wrongTarget" ? `${meta.options[3]} selected` : meta.options[1]}</li>
        <li>{meta.options[2]}</li>
      </ol>
      <div className="redo-stack-panel bad">
        <strong>{mode === "destructive" ? "External effect" : mode === "stale" ? "Stale branch" : "Unclear redo"}</strong>
        <span>{copy[mode]}</span>
      </div>
      <div className="demo-row redo-mode-controls">
        <button type="button" className={mode === "missing" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("missing")}>Missing redo</button>
        <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale")}>Stale redo</button>
        <button type="button" className={mode === "wrongTarget" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongTarget")}>Wrong target</button>
        <button type="button" className={mode === "hiddenStack" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenStack")}>Hidden stack</button>
        <button type="button" className={mode === "destructive" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("destructive")}>Destructive redo</button>
        <button type="button" className={mode === "keyboardOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("keyboardOnly")}>Keyboard only</button>
      </div>
      <p className="demo-status">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <UndoUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <UndoUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <UndoGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <UndoBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
