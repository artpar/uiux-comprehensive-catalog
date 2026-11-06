import { useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

function AmbiguousDestructiveCopyGoodUi() {
  return (
    <div className="ambiguous-destructive-card" aria-label="Clear destructive action copy">
      <div className="ambiguous-destructive-head">
        <div>
          <strong>Delete Payments project?</strong>
          <span>This will permanently delete 4 dashboards, 12 saved views, and 3 webhooks.</span>
        </div>
        <span className="ambiguous-destructive-chip">Specific copy</span>
      </div>
      <div className="ambiguous-destructive-copy-grid" aria-label="Clear destructive labels">
        <div>
          <span>Final action</span>
          <strong>Delete Payments project</strong>
          <small>Verb and target match the dialog title.</small>
        </div>
        <div>
          <span>Safe action</span>
          <strong>Keep project</strong>
          <small>The preserved outcome is explicit.</small>
        </div>
        <div>
          <span>Receipt</span>
          <strong>Payments project deleted</strong>
          <small>Post-action copy repeats the committed outcome.</small>
        </div>
      </div>
      <div className="ambiguous-destructive-actions">
        <button type="button" className="demo-button small">{`Keep project`}</button>
        <button type="button" className="demo-button small danger">Delete Payments project</button>
      </div>
      <p className="demo-status">The destructive and safe controls are understandable without relying on color, position, or surrounding paragraphs.</p>
    </div>
  );
}

function AmbiguousDestructiveCopyBadUi() {
  return (
    <div className="ambiguous-destructive-card bad" aria-label="Ambiguous destructive action copy">
      <div className="ambiguous-destructive-head">
        <div>
          <strong>Are you sure?</strong>
          <span>This action may affect your project.</span>
        </div>
        <span className="ambiguous-destructive-chip bad">Vague</span>
      </div>
      <div className="ambiguous-destructive-copy-grid bad">
        <div>
          <span>Primary</span>
          <strong>OK</strong>
          <small>Does not say what commits.</small>
        </div>
        <div>
          <span>Secondary</span>
          <strong>Cancel</strong>
          <small>Could close the dialog or cancel a service.</small>
        </div>
      </div>
      <div className="ambiguous-destructive-actions">
        <button type="button" className="demo-button small">Cancel</button>
        <button type="button" className="demo-button small danger">OK</button>
      </div>
      <p className="demo-status">The labels force users to infer destruction from color and context instead of naming the outcome.</p>
    </div>
  );
}

function AmbiguousDestructiveCopyGoodUx({ meta }: { meta: PatternMeta }) {
  type GoodMode = "clearTitle" | "finalAction" | "safeAction" | "cancelAmbiguity" | "reversibleCleanup" | "bulkScope" | "accessRemoval" | "externalEffect" | "mobileCompact";
  const [mode, setMode] = useState<GoodMode>("clearTitle");
  const states: Record<GoodMode, { label: string; title: string; body: string; primary: string; secondary: string; status: string; chips: [string, string, string][] }> = {
    clearTitle: {
      label: "Clear title",
      title: "Delete Payments project?",
      body: "The title names the destructive verb and the exact target before any action labels appear.",
      primary: meta.options[0],
      secondary: meta.options[1],
      status: "Clear destructive title anchors the button copy and prevents Are you sure ambiguity.",
      chips: [["Verb", "Delete", "Destructive action is named."], ["Target", "Payments project", "Object is explicit."], ["Outcome", "Permanent loss", "Consequence is stated."]]
    },
    finalAction: {
      label: "Final action",
      title: "Commit deletion",
      body: "The final button repeats the destructive operation and target.",
      primary: meta.options[0],
      secondary: meta.options[1],
      status: "Final action copy says what happens, not just Confirm or Continue.",
      chips: [["Primary", meta.options[0], "Specific destructive label."], ["Avoid", "OK", "No outcome."], ["Avoid", "Confirm", "No target."]]
    },
    safeAction: {
      label: "Safe action",
      title: "Leave project unchanged",
      body: "The safe button names the preserved state instead of a vague negative response.",
      primary: meta.options[1],
      secondary: "Back to project settings",
      status: "Safe action copy tells users what remains unchanged.",
      chips: [["Safe path", meta.options[1], "Preserves the project."], ["Return", "Project settings", "Focus destination is clear."], ["Avoid", "No", "No outcome."]]
    },
    cancelAmbiguity: {
      label: "Cancel ambiguity",
      title: "Cancel Pro subscription?",
      body: "Cancel could mean close this dialog or cancel the plan, so both actions name their outcome.",
      primary: meta.options[2],
      secondary: "Keep Pro subscription",
      status: "Cancel ambiguity is resolved by naming the plan outcome on both buttons.",
      chips: [["Risk word", "Cancel", "Has two meanings."], ["Preserve", "Keep Pro", "Safe path is clear."], ["Commit", "Cancel Pro", "Destructive path is clear."]]
    },
    reversibleCleanup: {
      label: "Reversible cleanup",
      title: "Archive saved view?",
      body: "This action can be undone, so the label says Archive and the feedback carries Undo.",
      primary: "Archive saved view",
      secondary: "Keep saved view",
      status: "Reversible cleanup is not mislabeled as permanent deletion.",
      chips: [["Operation", "Archive", "Recoverable action."], ["Recovery", "Undo", "Exact restore available."], ["Avoid", "Delete", "Would overstate loss."]]
    },
    bulkScope: {
      label: "Bulk scope",
      title: "Permanently delete 12 files?",
      body: "The selected count and object type remain visible in title and final action.",
      primary: meta.options[4],
      secondary: "Keep 12 files",
      status: "Bulk destructive copy updates count and object type before commit.",
      chips: [["Count", "12", "Selection scope is visible."], ["Type", "Files", "Object type is visible."], ["Commit", meta.options[4], "No hidden batch size."]]
    },
    accessRemoval: {
      label: "Access removal",
      title: "Revoke Maya's editor access?",
      body: "Remove is replaced with a verb that says access changes, not account deletion.",
      primary: meta.options[3],
      secondary: "Keep Maya's access",
      status: "Access-removal copy distinguishes revoking permission from deleting a person or record.",
      chips: [["Verb", "Revoke", "Permission action."], ["Target", "Maya's access", "Not the person."], ["Role", "Editor", "Scope is named."]]
    },
    externalEffect: {
      label: "External effect",
      title: "Send cancellation email to customer?",
      body: "The button says Send email because the side effect leaves the product boundary.",
      primary: "Send cancellation email",
      secondary: "Keep draft only",
      status: "External-effect copy reveals what will be sent, published, charged, revoked, or run.",
      chips: [["Boundary", "Email leaves system", "External side effect."], ["Target", "Customer", "Recipient is clear."], ["Avoid", "Continue", "Hides execution."]]
    },
    mobileCompact: {
      label: "Mobile compact",
      title: "Delete 12 files?",
      body: "Compact labels stay short while retaining verb, count, and object type.",
      primary: "Delete 12 files",
      secondary: "Keep files",
      status: "Mobile compact copy keeps the destructive outcome visible without truncating to OK.",
      chips: [["Compact", "Delete 12 files", "Still specific."], ["Safe", "Keep files", "Preserves outcome."], ["Accessible", "Full label", "Screen reader name matches."]]
    }
  };
  const current = states[mode];

  return (
    <div className={`quality-example ambiguous-destructive-good-ux is-${mode}`}>
      <div className="demo-row ambiguous-destructive-controls">
        {(Object.keys(states) as GoodMode[]).map((item) => (
          <button type="button" key={item} className={mode === item ? "demo-button small primary" : "demo-button small"} onClick={() => setMode(item)}>
            {states[item].label}
          </button>
        ))}
      </div>
      <div className="ambiguous-destructive-card">
        <div className="ambiguous-destructive-head">
          <div>
            <strong>{current.title}</strong>
            <span>{current.body}</span>
          </div>
          <span className="ambiguous-destructive-chip">Outcome named</span>
        </div>
        <div className="ambiguous-destructive-copy-grid">
          {current.chips.map(([label, value, detail]) => (
            <div key={`${label}-${value}`}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
        <div className="ambiguous-destructive-actions">
          <button type="button" className="demo-button small">{current.secondary}</button>
          <button type="button" className="demo-button small danger">{current.primary}</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{current.status}</p>
    </div>
  );
}

function AmbiguousDestructiveCopyBadUx() {
  type BadMode = "okDelete" | "yesNo" | "continueExecutes" | "removeAmbiguity" | "cancelAmbiguity" | "sameCopy" | "colorOnly" | "postCommit";
  const [mode, setMode] = useState<BadMode>("okDelete");
  const states: Record<BadMode, { label: string; title: string; body: string; primary: string; secondary: string; status: string; detail: string }> = {
    okDelete: {
      label: "OK delete",
      title: "Are you sure?",
      body: "The dialog hides that OK permanently deletes the project.",
      primary: "OK",
      secondary: "Cancel",
      status: "OK carries no destructive verb, target, scope, or outcome.",
      detail: "Users infer from color or memory instead of the button text."
    },
    yesNo: {
      label: "Yes / No",
      title: "Delete this?",
      body: "Yes and No require users to reread surrounding text before every choice.",
      primary: "Yes",
      secondary: "No",
      status: "Yes and No lose meaning when controls are read out of context.",
      detail: "The accessible names do not include the target."
    },
    continueExecutes: {
      label: "Continue executes",
      title: "Review customer refund",
      body: "Continue actually sends the refund and email.",
      primary: "Continue",
      secondary: "Back",
      status: "Continue suggests navigation, not high-impact execution.",
      detail: "Users think another review step follows."
    },
    removeAmbiguity: {
      label: "Remove ambiguity",
      title: "Remove Maya?",
      body: "Remove does not say whether Maya is deleted, hidden, detached, or access is revoked.",
      primary: "Remove",
      secondary: "Cancel",
      status: "Remove is ambiguous when list membership, account identity, and access grants are all in play.",
      detail: "The action should say Revoke Maya's editor access."
    },
    cancelAmbiguity: {
      label: "Cancel ambiguity",
      title: "Cancel subscription?",
      body: "Both the dialog and the underlying plan can be cancelled.",
      primary: "Cancel",
      secondary: "Cancel",
      status: "Duplicate Cancel labels invert user intent and hide the safe path.",
      detail: "Use Keep plan and Cancel subscription."
    },
    sameCopy: {
      label: "Same copy",
      title: "Confirm action",
      body: "Archive, trash, revoke, and permanent delete all use the same labels.",
      primary: "Confirm",
      secondary: "Cancel",
      status: "Same-copy prompts train automatic dismissal and hide severity changes.",
      detail: "Each action needs its own verb and target."
    },
    colorOnly: {
      label: "Color-only danger",
      title: "Proceed?",
      body: "Only the red styling indicates that the action is destructive.",
      primary: "Confirm",
      secondary: "Back",
      status: "Color-only danger fails for users who cannot perceive or trust the visual cue.",
      detail: "The label itself must name destruction."
    },
    postCommit: {
      label: "Post-commit",
      title: "Done",
      body: "The UI explains after commit that the project was deleted.",
      primary: "Done",
      secondary: "Close",
      status: "Clarifying only after commit is too late to support an informed decision.",
      detail: "The final action needed specific copy before execution."
    }
  };
  const current = states[mode];

  return (
    <div className={`quality-example ambiguous-destructive-bad-ux is-${mode}`}>
      <div className="demo-row ambiguous-destructive-controls">
        {(Object.keys(states) as BadMode[]).map((item) => (
          <button type="button" key={item} className={mode === item ? "demo-button small primary" : "demo-button small"} onClick={() => setMode(item)}>
            {states[item].label}
          </button>
        ))}
      </div>
      <div className="ambiguous-destructive-card bad">
        <div className="ambiguous-destructive-head">
          <div>
            <strong>{current.title}</strong>
            <span>{current.body}</span>
          </div>
          <span className="ambiguous-destructive-chip bad">{mode === "colorOnly" ? "Red only" : "Ambiguous"}</span>
        </div>
        <div className="ambiguous-destructive-copy-grid bad">
          <div>
            <span>Primary label</span>
            <strong>{current.primary}</strong>
            <small>{current.detail}</small>
          </div>
          <div>
            <span>Secondary label</span>
            <strong>{current.secondary}</strong>
            <small>No preserved outcome is named.</small>
          </div>
        </div>
        <div className="ambiguous-destructive-actions">
          <button type="button" className="demo-button small">{current.secondary}</button>
          <button type="button" className="demo-button small danger">{current.primary}</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{current.status}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AmbiguousDestructiveCopyGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AmbiguousDestructiveCopyBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <AmbiguousDestructiveCopyGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AmbiguousDestructiveCopyBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
