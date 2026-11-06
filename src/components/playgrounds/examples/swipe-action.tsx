import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SwipeActionMode =
  | "idle"
  | "hint"
  | "partial"
  | "threshold"
  | "snapBack"
  | "revealed"
  | "committed"
  | "destructive"
  | "undo"
  | "bidirectional"
  | "disabled"
  | "scrollConflict"
  | "keyboard"
  | "screenReader"
  | "bulk"
  | "mobile";

type SwipeActionBadMode =
  | "hiddenOnly"
  | "accidentalDelete"
  | "noUndo"
  | "verticalConflict"
  | "iconMystery"
  | "destructiveNoConfirm"
  | "noEquivalent";

const swipeActionGoodLabels: Array<[SwipeActionMode, string]> = [
  ["idle", "Idle row"],
  ["hint", "Gesture hint"],
  ["partial", "Partial reveal"],
  ["threshold", "Threshold"],
  ["snapBack", "Snap back"],
  ["revealed", "Revealed actions"],
  ["committed", "Committed action"],
  ["destructive", "Destructive action"],
  ["undo", "Undo"],
  ["bidirectional", "Bidirectional actions"],
  ["disabled", "Disabled action"],
  ["scrollConflict", "Scroll conflict"],
  ["keyboard", "Keyboard path"],
  ["screenReader", "Screen reader action"],
  ["bulk", "Bulk selection"],
  ["mobile", "Mobile compact"]
];

const swipeActionBadLabels: Array<[SwipeActionBadMode, string]> = [
  ["hiddenOnly", "Hidden-only"],
  ["accidentalDelete", "Accidental delete"],
  ["noUndo", "No undo"],
  ["verticalConflict", "Vertical conflict"],
  ["iconMystery", "Icon mystery"],
  ["destructiveNoConfirm", "Destructive no confirm"],
  ["noEquivalent", "No equivalent"]
];

function SwipeActionPanel({ mode, idSuffix }: { mode: SwipeActionMode; idSuffix: string }) {
  const config: Record<SwipeActionMode, {
    chip: string;
    title: string;
    rowOffset: string;
    background: string;
    row: string;
    threshold: string;
    equivalent: string;
    recovery: string;
    conflict: string;
    result: string;
    tone?: string;
    compact?: boolean;
  }> = {
    idle: {
      chip: "Idle row",
      title: "Message row shows identity and action path",
      rowOffset: "0%",
      background: "Archive and More actions are available from swipe action and row action menu.",
      row: "Budget review message, unread, updated 10:42.",
      threshold: "No horizontal swipe action is armed.",
      equivalent: "More actions button exposes Archive, Mark read, Pin, and Delete.",
      recovery: "No change has occurred.",
      conflict: "Row tap opens the message; vertical scroll remains available.",
      result: "The row is usable before the gesture is discovered."
    },
    hint: {
      chip: "Gesture hint",
      title: "Swipe hint teaches the shortcut",
      rowOffset: "8%",
      background: "Short hint says Swipe row for actions or use More actions.",
      row: "A subtle handle and text label identify the row-scoped action region.",
      threshold: "Hint movement stays below commit threshold.",
      equivalent: "The visible More actions trigger remains beside the row.",
      recovery: "Release cancels the hint animation.",
      conflict: "Hint does not steal focus or scroll.",
      result: "Swipe action is discoverable without being required."
    },
    partial: {
      chip: "Partial reveal",
      title: "Action label appears behind row",
      rowOffset: "38%",
      background: "Archive message appears with icon and text as the row moves horizontally.",
      row: "Budget review remains visible so the affected object is clear.",
      threshold: "Partial reveal is below commit threshold.",
      equivalent: "More actions offers the same Archive command.",
      recovery: "Release before threshold snaps the row back.",
      conflict: "Vertical scroll is locked out only after horizontal intent is clear.",
      result: "Users preview the action before any model change."
    },
    threshold: {
      chip: "Threshold",
      title: "Release boundary is explicit",
      rowOffset: "72%",
      background: "Release to archive Budget review.",
      row: "The row crosses the action threshold and changes background emphasis.",
      threshold: "Threshold reached at 72% row width.",
      equivalent: "Action menu Archive uses the same pending state.",
      recovery: "Reversing under threshold cancels.",
      conflict: "Diagonal movement under the angle lock keeps scrolling.",
      result: "The commit boundary is visible and reversible before release."
    },
    snapBack: {
      chip: "Snap back",
      title: "Below-threshold release cancels",
      rowOffset: "18%",
      background: "Archive preview faded because release occurred early.",
      row: "Budget review stays unread in the same list position.",
      threshold: "Below threshold; no action fired.",
      equivalent: "Keyboard and menu state remain unchanged.",
      recovery: "No undo needed because nothing changed.",
      conflict: "Pointer cancellation returns to idle.",
      result: "Snap back preserves row state."
    },
    revealed: {
      chip: "Revealed actions",
      title: "Swipe reveals explicit row buttons",
      rowOffset: "54%",
      background: "Archive, Mark read, and More actions are visible behind this row.",
      row: "The swiped row stays associated with the revealed buttons.",
      threshold: "Swipe reveals commands; tap commits one command.",
      equivalent: "The row action menu contains the same commands.",
      recovery: "Escape or tapping elsewhere closes the reveal.",
      conflict: "Only one row stays open at a time.",
      result: "Reveal mode avoids hidden immediate execution."
    },
    committed: {
      chip: "Committed action",
      title: "Safe action completes with status",
      rowOffset: "100%",
      background: "Archive message committed.",
      row: "Budget review moved to Archived with row position preserved for nearby items.",
      threshold: "Release after threshold committed Archive.",
      equivalent: "Menu Archive produces the same archived state.",
      recovery: "Undo archive is shown for 8 seconds.",
      conflict: "Duplicate activation is disabled while status is visible.",
      result: "Committed swipe action names the affected row.",
      tone: "safe"
    },
    destructive: {
      chip: "Destructive action",
      title: "Delete requires review or reliable recovery",
      rowOffset: "60%",
      background: "Delete is red, labeled, and not committed until tapped.",
      row: "Budget review shows the Delete file consequence before execution.",
      threshold: "Swipe reveals Delete; it does not instantly destroy the row.",
      equivalent: "Action menu routes Delete to the same confirmation.",
      recovery: "Confirmation or undo is required according to reversibility.",
      conflict: "Destructive action is not adjacent to routine Mark read.",
      result: "Risky swipe action is slowed down deliberately."
    },
    undo: {
      chip: "Undo",
      title: "Recovery path follows completion",
      rowOffset: "100%",
      background: "Budget review archived.",
      row: "Status says Budget review archived.",
      threshold: "The prior swipe crossed threshold and committed Archive.",
      equivalent: "Menu Archive also shows Undo archive.",
      recovery: "Undo archive restores the row to Inbox and unread state.",
      conflict: "A second archive cannot overwrite this undo target silently.",
      result: "Post-action recovery is row-specific.",
      tone: "safe"
    },
    bidirectional: {
      chip: "Bidirectional actions",
      title: "Left and right swipes are distinct",
      rowOffset: "42%",
      background: "Left swipe archives; right swipe pins. Direction labels stay visible.",
      row: "Budget review shows which direction is active.",
      threshold: "Each direction has its own threshold and color.",
      equivalent: "Action menu lists Archive and Pin with the same labels.",
      recovery: "Undo names Archive or Pin separately.",
      conflict: "Opposite direction cancels the first preview.",
      result: "Multiple actions do not become icon guessing."
    },
    disabled: {
      chip: "Disabled action",
      title: "Unavailable command explains why",
      rowOffset: "34%",
      background: "Delete disabled: retention policy locks this message.",
      row: "The row can still be marked read or pinned.",
      threshold: "Disabled command cannot be committed by crossing threshold.",
      equivalent: "Action menu shows the same disabled reason.",
      recovery: "No destructive outcome is possible.",
      conflict: "Disabled swipe snaps back to visible explanation.",
      result: "Permission limits are consistent across paths."
    },
    scrollConflict: {
      chip: "Scroll conflict",
      title: "Vertical scroll and pull-to-refresh win appropriately",
      rowOffset: "12%",
      background: "Horizontal swipe action waits until movement angle is clear.",
      row: "The list scrolls vertically when movement is mostly up or down.",
      threshold: "Swipe threshold is not evaluated during vertical scroll.",
      equivalent: "More actions works when gestures conflict.",
      recovery: "No row command runs from diagonal scroll.",
      conflict: "Pull to refresh at top and row swipe use separate axes.",
      result: "Accidental diagonal movement does not archive the row."
    },
    keyboard: {
      chip: "Keyboard path",
      title: "Non-gesture equivalent is complete",
      rowOffset: "0%",
      background: "More actions menu is focused.",
      row: "Keyboard focus reaches Budget review row actions after the row title.",
      threshold: "No path-based gesture is required.",
      equivalent: "Enter opens More actions; Escape closes revealed actions.",
      recovery: "Undo and confirmation are keyboard reachable.",
      conflict: "Arrow keys follow list navigation instead of hidden swipe.",
      result: "Keyboard users can run every row action."
    },
    screenReader: {
      chip: "Screen reader action",
      title: "Custom actions are named",
      rowOffset: "0%",
      background: "Screen reader actions: Archive Budget review, Mark read, Delete Budget review.",
      row: "The row exposes object name, unread state, and available row actions.",
      threshold: "Swipe threshold is not the accessibility contract.",
      equivalent: "Actions are available through custom actions and More actions.",
      recovery: "Status announces Budget review archived. Undo archive available.",
      conflict: "Touch exploration does not trigger hidden swipe.",
      result: "Assistive technology receives the same choices."
    },
    bulk: {
      chip: "Bulk selection",
      title: "Selected-set actions stay separate",
      rowOffset: "0%",
      background: "Two messages selected; row swipe is disabled while bulk toolbar is active.",
      row: "Budget review is selected as part of a set of 2.",
      threshold: "Swipe threshold is suspended during bulk selection.",
      equivalent: "Bulk toolbar offers Archive selected and More selected actions.",
      recovery: "Undo names the selected count after bulk archive.",
      conflict: "Row-level swipe does not silently act on a selected set.",
      result: "Row action and bulk action scopes cannot drift."
    },
    mobile: {
      chip: "Mobile compact",
      title: "Labels and controls fit compact width",
      rowOffset: "48%",
      background: "Archive message and More actions wrap without overlap.",
      row: "Budget review, unread badge, timestamp, and action menu remain readable.",
      threshold: "Threshold copy fits large text.",
      equivalent: "More actions button remains reachable.",
      recovery: "Undo archive fits below the row.",
      conflict: "System back edge and row swipe regions are separated.",
      result: "Swipe action remains understandable on a small screen.",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `swipe-action-title-${idSuffix}`;
  const descId = `swipe-action-desc-${idSuffix}`;

  return (
    <section className={`swipe-action-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="swipe-action-header">
        <span>{item.chip}</span>
        <strong id={titleId}>{item.title}</strong>
      </header>
      <div className="swipe-action-stage" id={descId}>
        <div className="swipe-action-row-wrap" style={{ ["--swipe-offset" as string]: item.rowOffset }}>
          <div className="swipe-action-background" aria-hidden="true">
            <span>Archive</span>
            <span>More actions</span>
          </div>
          <div className="swipe-action-row">
            <div>
              <strong>Budget review</strong>
              <span>{item.row}</span>
            </div>
            <button type="button" className="demo-button small">More actions</button>
          </div>
        </div>
        <p>{item.background}</p>
      </div>
      <div className="swipe-action-grid" aria-label="Swipe action evidence">
        <div><span>Horizontal swipe</span><strong>{item.rowOffset} row offset</strong></div>
        <div><span>Threshold</span><strong>{item.threshold}</strong></div>
        <div><span>Action menu</span><strong>{item.equivalent}</strong></div>
        <div><span>Undo or confirm</span><strong>{item.recovery}</strong></div>
        <div><span>Conflict rule</span><strong>{item.conflict}</strong></div>
        <div><span>Status message</span><strong>{item.result}</strong></div>
      </div>
      <p className="demo-status">{item.result}</p>
    </section>
  );
}

function SwipeActionGoodUi() {
  return (
    <div className="quality-example swipe-action-demo">
      <SwipeActionPanel mode="partial" idSuffix="good-ui" />
    </div>
  );
}

function SwipeActionBadUi() {
  return (
    <div className="bad-ui-sample swipe-action-bad-ui">
      <section className="swipe-action-shell bad" aria-label="Broken swipe action">
        <header className="swipe-action-header">
          <span>Hidden-only</span>
          <strong>Delete by surprise</strong>
        </header>
        <p>The row deletes on a hidden horizontal swipe with no gesture hint, action label, threshold, snap back, row action menu, undo, confirmation, status message, or screen reader action.</p>
        <div className="swipe-action-stage bad">
          <div className="swipe-action-row-wrap">
            <div className="swipe-action-background" aria-hidden="true"><span>?</span><span>!</span></div>
            <div className="swipe-action-row">
              <div><strong>Critical alert</strong><span>Unread row with no visible actions.</span></div>
              <span>Swipe</span>
            </div>
          </div>
        </div>
      </section>
      <p className="demo-status">The broken UI makes a destructive row action invisible and unrecoverable.</p>
    </div>
  );
}

function SwipeActionGoodUx() {
  const [mode, setMode] = useState<SwipeActionMode>("idle");
  return (
    <div className="quality-example swipe-action-demo">
      <div className="demo-row swipe-action-controls" aria-label="Swipe action exercise controls">
        {swipeActionGoodLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <SwipeActionPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Swipe action state: {swipeActionGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function SwipeActionBadUx() {
  const [mode, setMode] = useState<SwipeActionBadMode>("hiddenOnly");
  const copy: Record<SwipeActionBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    hiddenOnly: {
      title: "Hidden-only",
      body: "Archive, Delete, and More actions exist only behind a hidden horizontal swipe.",
      consequence: "Users who do not discover the gesture cannot act on the row.",
      metric: "No action menu"
    },
    accidentalDelete: {
      title: "Accidental delete",
      body: "A diagonal scroll crosses a loose threshold and immediately deletes the row.",
      consequence: "Reading the list changes data unexpectedly.",
      metric: "Loose threshold"
    },
    noUndo: {
      title: "No undo",
      body: "Archive completes but there is no Undo archive, status message, or restore path.",
      consequence: "A recoverable mistake becomes permanent.",
      metric: "No recovery"
    },
    verticalConflict: {
      title: "Vertical conflict",
      body: "Vertical scroll, pull-to-refresh, row navigation, and swipe action can all trigger from the same movement.",
      consequence: "Users cannot predict which action will win.",
      metric: "Gesture conflict"
    },
    iconMystery: {
      title: "Icon mystery",
      body: "Two unlabeled icons appear behind the row with only color to distinguish archive from delete.",
      consequence: "Users must guess the row action meaning.",
      metric: "No labels"
    },
    destructiveNoConfirm: {
      title: "Destructive no confirm",
      body: "Delete fires on release even though the item cannot be restored and no confirmation dialog appears.",
      consequence: "A high-impact row action bypasses review.",
      metric: "No confirmation"
    },
    noEquivalent: {
      title: "No equivalent",
      body: "Keyboard, screen reader, switch, mouse, and assistive pointer users have no non-gesture path.",
      consequence: "The path-based swipe action excludes users.",
      metric: "Gesture only"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example swipe-action-bad-ux is-${mode}`}>
      <div className="demo-row swipe-action-controls" aria-label="Swipe action misuse controls">
        {swipeActionBadLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="swipe-action-shell bad" aria-label={`Swipe action failure: ${item.title}`}>
        <header className="swipe-action-header">
          <span>{item.title}</span>
          <strong>{item.metric}</strong>
        </header>
        <p>{item.body}</p>
        <div className="swipe-action-grid">
          <div><span>Horizontal swipe</span><strong>{mode === "hiddenOnly" ? "Hidden" : "Unsafe"}</strong></div>
          <div><span>Threshold</span><strong>{mode === "accidentalDelete" ? "Too loose" : "Unclear"}</strong></div>
          <div><span>Action menu</span><strong>{mode === "noEquivalent" || mode === "hiddenOnly" ? "Missing" : "Mismatch"}</strong></div>
          <div><span>Undo or confirm</span><strong>{mode === "noUndo" || mode === "destructiveNoConfirm" ? "Missing" : "Not guaranteed"}</strong></div>
          <div><span>Conflict rule</span><strong>{mode === "verticalConflict" ? "None" : "Weak"}</strong></div>
          <div><span>Status message</span><strong>{item.consequence}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SwipeActionGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SwipeActionBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SwipeActionGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SwipeActionBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
