import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type EditableAiOutputState =
  | "generated"
  | "userEdited"
  | "sourceMapping"
  | "citationPreservation"
  | "unsupportedEdit"
  | "trackedChange"
  | "acceptEdit"
  | "rejectEdit"
  | "applyOutput"
  | "saveDraft"
  | "undoGenerated"
  | "regenerateFromEdit"
  | "staleSource"
  | "unsafeEdit"
  | "reviewRequired"
  | "partialEdit"
  | "conflictEdit"
  | "mobile"
  | "copyEdited";

type EditableAiOutputCopy = {
  label: string;
  message: string;
  status: string;
  source: string;
  citation: string;
  review: string;
  action: string;
  tone: "ready" | "working" | "warning" | "danger";
};

const editableAiOutputCopy: Record<EditableAiOutputState, EditableAiOutputCopy> = {
  generated: {
    label: "Generated draft",
    message: "Editable AI output starts with a generated draft and keeps the original baseline recoverable.",
    status: "Original generated text",
    source: "Policy source A and B mapped",
    citation: "Three citations preserved",
    review: "No user edited text yet",
    action: "Open editor",
    tone: "ready"
  },
  userEdited: {
    label: "User edited",
    message: "User edited text is visibly distinct from the generated draft before it is accepted.",
    status: "Two edited ranges",
    source: "One range needs source mapping",
    citation: "Two citations preserved",
    review: "Reviewer name and time recorded",
    action: "Review edits",
    tone: "working"
  },
  sourceMapping: {
    label: "Source mapping",
    message: "Source mapping links the edited claim back to citation display, source grounding display, and file evidence.",
    status: "Claim-level map open",
    source: "Section 4.2 supports paragraph 2",
    citation: "Citation [2] preview available",
    review: "Mapping verified",
    action: "Open source",
    tone: "ready"
  },
  citationPreservation: {
    label: "Citation preservation",
    message: "Citation preservation keeps unchanged claims linked and flags changed claims for review.",
    status: "Unchanged claim retained",
    source: "Source unchanged",
    citation: "Citation [1] and [3] retained",
    review: "Changed claim queued",
    action: "Inspect citations",
    tone: "ready"
  },
  unsupportedEdit: {
    label: "Unsupported edit",
    message: "Unsupported edit state blocks apply output until the claim has evidence or is removed.",
    status: "Unsupported claim",
    source: "No matching source",
    citation: "Citation removed from edited claim",
    review: "Review required",
    action: "Resolve support",
    tone: "warning"
  },
  trackedChange: {
    label: "Tracked change",
    message: "Tracked change controls show inserted, removed, and replaced text with accept edit and reject edit actions.",
    status: "Change pending",
    source: "Original source retained",
    citation: "Citation status pending",
    review: "Awaiting reviewer decision",
    action: "Accept or reject",
    tone: "working"
  },
  acceptEdit: {
    label: "Accept edit",
    message: "Accept edit commits the proposed user change while preserving author, source state, and review record.",
    status: "Change accepted",
    source: "Source map refreshed",
    citation: "Citation preservation checked",
    review: "Accepted by reviewer",
    action: "Continue review",
    tone: "ready"
  },
  rejectEdit: {
    label: "Reject edit",
    message: "Reject edit restores the affected range to generated draft text without losing later saved versions.",
    status: "Change rejected",
    source: "Generated baseline restored",
    citation: "Original citation restored",
    review: "Rejection reason saved",
    action: "Restore generated",
    tone: "ready"
  },
  applyOutput: {
    label: "Apply output",
    message: "Apply output is enabled only when edits, sources, citations, and review required states are resolved.",
    status: "Ready to apply",
    source: "All claims mapped",
    citation: "All citations valid",
    review: "Review complete",
    action: "Apply output",
    tone: "ready"
  },
  saveDraft: {
    label: "Save draft",
    message: "Save draft preserves generated draft, user edited output, warnings, and pending review state.",
    status: "Saved draft v3",
    source: "Mappings saved",
    citation: "Citation state saved",
    review: "Pending items retained",
    action: "Save draft",
    tone: "ready"
  },
  undoGenerated: {
    label: "Undo to generated",
    message: "Undo to generated restores the original AI text for a selected range or the whole answer.",
    status: "Generated text restored",
    source: "Original mapping restored",
    citation: "Original citations restored",
    review: "Undo recorded",
    action: "Undo to generated",
    tone: "ready"
  },
  regenerateFromEdit: {
    label: "Regenerate from edit",
    message: "Regenerate from edit uses the accepted draft as context and keeps manual edits recoverable.",
    status: "Regeneration preview",
    source: "Source scope unchanged",
    citation: "Pending regenerated citations",
    review: "Compare before replace",
    action: "Regenerate",
    tone: "working"
  },
  staleSource: {
    label: "Stale source",
    message: "Stale source warns that the edited claim relies on an older source version.",
    status: "Source version changed",
    source: "Policy source updated today",
    citation: "Citation needs refresh",
    review: "Review required",
    action: "Refresh source",
    tone: "warning"
  },
  unsafeEdit: {
    label: "Unsafe edit",
    message: "Unsafe edit marks policy-sensitive wording that cannot be applied without reviewer approval.",
    status: "Safety flag",
    source: "Conflict with policy source",
    citation: "Citation blocked",
    review: "Review required",
    action: "Request approval",
    tone: "danger"
  },
  reviewRequired: {
    label: "Review required",
    message: "Review required blocks final apply output while unsupported, unsafe, stale, or conflicted text remains.",
    status: "Apply blocked",
    source: "One source mapping unresolved",
    citation: "One citation pending",
    review: "Reviewer required",
    action: "Open review",
    tone: "warning"
  },
  partialEdit: {
    label: "Partial edit",
    message: "Partial edit limits the change to a selected range so the rest of the generated draft stays mapped.",
    status: "Selected sentence edited",
    source: "Other paragraphs unchanged",
    citation: "Unchanged citations preserved",
    review: "Only selection needs review",
    action: "Review selection",
    tone: "working"
  },
  conflictEdit: {
    label: "Conflict edit",
    message: "Conflict edit appears when source refresh or regeneration collides with manual edits.",
    status: "Conflict detected",
    source: "New source contradicts edit",
    citation: "Citation drift",
    review: "Choose generated or edited",
    action: "Resolve conflict",
    tone: "danger"
  },
  mobile: {
    label: "Mobile editor",
    message: "Mobile editor preserves source mapping, citation preservation, tracked change, review, and apply controls.",
    status: "Compact editor",
    source: "Source sheet available",
    citation: "Citation chips wrap",
    review: "Review footer pinned",
    action: "Open source sheet",
    tone: "ready"
  },
  copyEdited: {
    label: "Copy edited",
    message: "Copy edited includes visible provenance warnings when the destination needs them.",
    status: "Copied with metadata",
    source: "Source links included",
    citation: "Citation labels included",
    review: "Warnings included",
    action: "Copy edited",
    tone: "ready"
  }
};

function EditableAiOutputPanel({ state }: { state: EditableAiOutputState }) {
  const copy = editableAiOutputCopy[state];

  return (
    <section className={`editable-ai-output-shell is-${copy.tone}`} aria-label="Editable AI output">
      <header className="editable-ai-output-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="editable-ai-output-version">Draft v3</span>
      </header>
      <div className="editable-ai-output-draft" aria-label="Generated draft editor">
        <p>
          <span className="editable-ai-output-generated">Generated draft:</span> Remote-work stipend eligibility applies to employees assigned to home office status.
        </p>
        <p>
          <span className="editable-ai-output-edited">User edited:</span> Contractors require manager approval before reimbursement.
        </p>
      </div>
      <div className="editable-ai-output-grid">
        <span><b>Status</b>{copy.status}</span>
        <span><b>Source mapping</b>{copy.source}</span>
        <span><b>Citation preservation</b>{copy.citation}</span>
        <span><b>Review state</b>{copy.review}</span>
      </div>
      <div className="editable-ai-output-actions">
        <button type="button" className="demo-button small">Accept edit</button>
        <button type="button" className="demo-button small">Reject edit</button>
        <button type="button" className="demo-button small">{copy.action}</button>
      </div>
    </section>
  );
}

function EditableAiOutputGoodUi() {
  return (
    <div className="quality-example editable-ai-output-demo">
      <EditableAiOutputPanel state="sourceMapping" />
      <p className="demo-status">The editable AI output surface keeps generated draft, user edited text, source mapping, citation preservation, tracked change review, and apply output controls visible together.</p>
    </div>
  );
}

function EditableAiOutputBadUi() {
  return (
    <div className="bad-ui-sample editable-ai-output-bad-demo is-editable-looking-final">
      <div className="editable-ai-output-final-card">Final answer</div>
      <div className="editable-ai-output-broken-grid" aria-label="Broken editable AI output">
        <span>Editable-looking final</span>
        <span>Lost citations</span>
        <span>No generated draft</span>
        <span>No review required</span>
      </div>
      <p>The broken UI lets generated output look final while hiding user edited text, source mapping, citation preservation, and apply output review.</p>
    </div>
  );
}

function EditableAiOutputGoodUx() {
  const [state, setState] = useState<EditableAiOutputState>("generated");
  const [message, setMessage] = useState("Generated draft keeps the original AI output recoverable before editing.");
  const choose = (next: EditableAiOutputState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example editable-ai-output-demo">
      <div className="editable-ai-output-controls" aria-label="Editable AI output exercise controls">
        <button type="button" className={state === "generated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("generated", "Generated draft keeps the original answer and source coverage visible.")}>Generated draft</button>
        <button type="button" className={state === "userEdited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("userEdited", "User edited text is distinct from generated text.")}>User edited</button>
        <button type="button" className={state === "sourceMapping" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sourceMapping", "Source mapping opens claim-level evidence for the edited text.")}>Source mapping</button>
        <button type="button" className={state === "citationPreservation" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("citationPreservation", "Citation preservation keeps unchanged claims linked and flags changed claims.")}>Citation preservation</button>
        <button type="button" className={state === "unsupportedEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unsupportedEdit", "Unsupported edit blocks apply output until evidence is resolved.")}>Unsupported edit</button>
        <button type="button" className={state === "trackedChange" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("trackedChange", "Tracked change exposes accept edit and reject edit decisions.")}>Tracked change</button>
        <button type="button" className={state === "acceptEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("acceptEdit", "Accept edit commits the user change with review metadata.")}>Accept edit</button>
        <button type="button" className={state === "rejectEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rejectEdit", "Reject edit restores generated draft text for the selected range.")}>Reject edit</button>
        <button type="button" className={state === "applyOutput" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("applyOutput", "Apply output becomes available only after review is complete.")}>Apply output</button>
        <button type="button" className={state === "saveDraft" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("saveDraft", "Save draft keeps warnings, citations, and review state.")}>Save draft</button>
        <button type="button" className={state === "undoGenerated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("undoGenerated", "Undo to generated restores original AI text without deleting versions.")}>Undo to generated</button>
        <button type="button" className={state === "regenerateFromEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("regenerateFromEdit", "Regenerate from edit previews new output without overwriting manual edits.")}>Regenerate from edit</button>
        <button type="button" className={state === "staleSource" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("staleSource", "Stale source warns before using an outdated citation.")}>Stale source</button>
        <button type="button" className={state === "unsafeEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unsafeEdit", "Unsafe edit requires approval before final use.")}>Unsafe edit</button>
        <button type="button" className={state === "reviewRequired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reviewRequired", "Review required blocks apply output until warnings are resolved.")}>Review required</button>
        <button type="button" className={state === "partialEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("partialEdit", "Partial edit limits review to the selected generated range.")}>Partial edit</button>
        <button type="button" className={state === "conflictEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("conflictEdit", "Conflict edit protects manual changes during source refresh or regeneration.")}>Conflict edit</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile editor keeps source, review, and apply controls reachable.")}>Mobile editor</button>
        <button type="button" className={state === "copyEdited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copyEdited", "Copy edited carries required provenance warnings.")}>Copy edited</button>
      </div>
      <EditableAiOutputPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function EditableAiOutputBadUx() {
  type Mode = "editable-looking-final" | "lost-citations" | "silent-rewrite" | "apply-without-review" | "raw-prompt-edit" | "no-undo" | "source-drift";
  const [mode, setMode] = useState<Mode>("editable-looking-final");
  const copy: Record<Mode, string> = {
    "editable-looking-final": "Editable-looking final hides whether text is generated draft, user edited, accepted, rejected, or applied.",
    "lost-citations": "Lost citations remove citation preservation and source mapping after a small edit.",
    "silent-rewrite": "Silent rewrite regenerates over manual edits without compare, conflict edit, or recovery.",
    "apply-without-review": "Apply without review sends unsupported edit, unsafe edit, or stale source content forward.",
    "raw-prompt-edit": "Raw prompt edit changes hidden instructions instead of the visible generated output after creation.",
    "no-undo": "No undo removes the generated baseline and prevents undo to generated after a mistake.",
    "source-drift": "Source drift keeps citations attached to edited claims that the source no longer supports."
  };
  const labels: Record<Mode, string[]> = {
    "editable-looking-final": ["Editable-looking final", "No draft boundary", "No user edited state", "No review"],
    "lost-citations": ["Lost citations", "No source mapping", "No citation preservation", "No warning"],
    "silent-rewrite": ["Silent rewrite", "Manual edit replaced", "No conflict edit", "No compare"],
    "apply-without-review": ["Apply without review", "Unsupported edit", "Unsafe edit", "Review skipped"],
    "raw-prompt-edit": ["Raw prompt edit", "Hidden instruction", "Not output editing", "No baseline"],
    "no-undo": ["No undo", "Generated draft lost", "No version recovery", "No reject edit"],
    "source-drift": ["Source drift", "Stale source", "Citation mismatch", "Claim unsupported"]
  };

  return (
    <div className={`quality-example editable-ai-output-bad-demo is-${mode}`}>
      <div className="editable-ai-output-final-card">{mode === "lost-citations" ? "Edited text with no citations" : "Final answer"}</div>
      <div className="editable-ai-output-broken-grid" aria-label="Broken editable AI output">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "apply-without-review" ? "Apply without review" : "Editable AI output failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row editable-ai-output-controls">
        <button type="button" className={mode === "editable-looking-final" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("editable-looking-final")}>Editable-looking final</button>
        <button type="button" className={mode === "lost-citations" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lost-citations")}>Lost citations</button>
        <button type="button" className={mode === "silent-rewrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silent-rewrite")}>Silent rewrite</button>
        <button type="button" className={mode === "apply-without-review" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("apply-without-review")}>Apply without review</button>
        <button type="button" className={mode === "raw-prompt-edit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("raw-prompt-edit")}>Raw prompt edit</button>
        <button type="button" className={mode === "no-undo" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-undo")}>No undo</button>
        <button type="button" className={mode === "source-drift" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("source-drift")}>Source drift</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EditableAiOutputGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EditableAiOutputBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EditableAiOutputGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EditableAiOutputBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
