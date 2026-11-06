import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type DragAndDropMode =
  | "idle"
  | "pickup"
  | "dragging"
  | "validTarget"
  | "invalidTarget"
  | "insertion"
  | "autoScroll"
  | "dropPreview"
  | "success"
  | "canceled"
  | "failed"
  | "keyboard"
  | "screenReader"
  | "multiSelect"
  | "mobile"
  | "risky";

type DragAndDropBadMode =
  | "pointerOnly"
  | "noTargetFeedback"
  | "invalidSilent"
  | "scrollHijack"
  | "noCancel"
  | "serverMismatch"
  | "noEquivalent";

const dragAndDropGoodLabels: Array<[DragAndDropMode, string]> = [
  ["idle", "Idle object"],
  ["pickup", "Pickup handle"],
  ["dragging", "Dragging preview"],
  ["validTarget", "Valid target"],
  ["invalidTarget", "Invalid target"],
  ["insertion", "Insertion indicator"],
  ["autoScroll", "Auto-scroll"],
  ["dropPreview", "Drop preview"],
  ["success", "Successful drop"],
  ["canceled", "Canceled drag"],
  ["failed", "Failed drop"],
  ["keyboard", "Keyboard move"],
  ["screenReader", "Screen reader move"],
  ["multiSelect", "Multi-select drag"],
  ["mobile", "Mobile compact"],
  ["risky", "Risky move"]
];

const dragAndDropBadLabels: Array<[DragAndDropBadMode, string]> = [
  ["pointerOnly", "Pointer-only"],
  ["noTargetFeedback", "No target feedback"],
  ["invalidSilent", "Invalid silent"],
  ["scrollHijack", "Scroll hijack"],
  ["noCancel", "No cancel"],
  ["serverMismatch", "Server mismatch"],
  ["noEquivalent", "No equivalent"]
];

function DragAndDropPanel({ mode, idSuffix }: { mode: DragAndDropMode; idSuffix: string }) {
  const config: Record<DragAndDropMode, {
    chip: string;
    title: string;
    card: string;
    source: string;
    target: string;
    indicator: string;
    equivalent: string;
    cancel: string;
    result: string;
    tone?: string;
    compact?: boolean;
  }> = {
    idle: {
      chip: "Idle object",
      title: "Card can move without dragging",
      card: "Database backup is in To do with visible drag handle and Move button.",
      source: "Source: To do column, position 2.",
      target: "Destinations: Review, Done, Blocked.",
      indicator: "No pickup is active.",
      equivalent: "Move to column menu lists the same destinations.",
      cancel: "No change before pickup.",
      result: "Object identity and non-drag path are visible."
    },
    pickup: {
      chip: "Pickup handle",
      title: "Pickup starts from a deliberate handle",
      card: "The drag handle is active; row text selection and links are not dragged.",
      source: "Source placeholder remains in To do.",
      target: "Targets wait for movement before highlighting.",
      indicator: "Picked up 1 card.",
      equivalent: "Keyboard Move button is beside the handle.",
      cancel: "Escape or release before movement cancels.",
      result: "Pickup does not steal ordinary scroll or text selection."
    },
    dragging: {
      chip: "Dragging preview",
      title: "Preview follows the card",
      card: "Ghost card says Moving Database backup.",
      source: "To do keeps a placeholder so the original position is clear.",
      target: "Review and Done columns are visible.",
      indicator: "Drag preview names the selected object.",
      equivalent: "Move menu previews the same destination names.",
      cancel: "Drop outside any target returns to To do.",
      result: "Users can track source, object, and destination."
    },
    validTarget: {
      chip: "Valid target",
      title: "Review is a valid drop target",
      card: "Database backup can move to Review.",
      source: "Source remains To do until drop.",
      target: "Review column highlights as valid; insertion line appears.",
      indicator: "Drop here: Review, position 1.",
      equivalent: "Move to Review is enabled.",
      cancel: "Leaving the target removes the insertion preview.",
      result: "Valid destination is explicit before release.",
      tone: "safe"
    },
    invalidTarget: {
      chip: "Invalid target",
      title: "Done is blocked by policy",
      card: "Database backup cannot skip review.",
      source: "Source remains To do.",
      target: "Done column shows Invalid: review required.",
      indicator: "No drop will commit here.",
      equivalent: "Move to Done is disabled with the same reason.",
      cancel: "Release over Done snaps back unchanged.",
      result: "Invalid target reason appears before drop."
    },
    insertion: {
      chip: "Insertion indicator",
      title: "Position is previewed",
      card: "Database backup is between two Review cards.",
      source: "To do shows the prior placeholder.",
      target: "Review shows insertion line after Security audit.",
      indicator: "Position 2 of 4 in Review.",
      equivalent: "Move menu includes Place after Security audit.",
      cancel: "Escape restores To do position 2.",
      result: "Drop position is not guessed after release."
    },
    autoScroll: {
      chip: "Auto-scroll",
      title: "Large board scroll is controlled",
      card: "Dragging near the right edge reveals Later column slowly.",
      source: "Source placeholder stays visible in board summary.",
      target: "Edge-scroll target names the next hidden column.",
      indicator: "Auto-scroll speed is limited and pausable.",
      equivalent: "Move menu can choose hidden columns without edge dragging.",
      cancel: "Moving away from edge stops auto-scroll.",
      result: "Auto-scroll does not force wrong drops."
    },
    dropPreview: {
      chip: "Drop preview",
      title: "Consequence appears before commit",
      card: "Drop will move Database backup to Review and notify assignee.",
      source: "Source: To do.",
      target: "Destination: Review.",
      indicator: "Status will change to In review.",
      equivalent: "Move menu shows the same status-change warning.",
      cancel: "Cancel keeps status To do.",
      result: "Users see the model change before release."
    },
    success: {
      chip: "Successful drop",
      title: "Move commits with recovery",
      card: "Database backup is now in Review.",
      source: "To do count decreased by 1.",
      target: "Review count increased by 1.",
      indicator: "Moved to Review. Undo move available.",
      equivalent: "Keyboard move produces the same result status.",
      cancel: "Undo returns to To do position 2.",
      result: "Successful drop preserves focus and recovery.",
      tone: "safe"
    },
    canceled: {
      chip: "Canceled drag",
      title: "Release outside target changes nothing",
      card: "Database backup returns to To do.",
      source: "Original source and position are restored.",
      target: "No destination accepted the card.",
      indicator: "Drag canceled.",
      equivalent: "Cancel in Move menu has the same result.",
      cancel: "Release outside, Escape, or Cancel all restore.",
      result: "Canceled drag leaves the model unchanged."
    },
    failed: {
      chip: "Failed drop",
      title: "Server rejection restores prior state",
      card: "Database backup visually returns to To do after save failure.",
      source: "Source is restored from saved state.",
      target: "Review rejects because sprint closed.",
      indicator: "Move failed: sprint closed. Try another destination.",
      equivalent: "Move menu shows the same failed state.",
      cancel: "Retry or choose a new destination.",
      result: "Visual state and server model do not diverge."
    },
    keyboard: {
      chip: "Keyboard move",
      title: "Move menu is equivalent",
      card: "Focus is on Database backup Move button.",
      source: "Current location: To do, position 2.",
      target: "Menu lists Review, Blocked, Later; Done is disabled.",
      indicator: "Choose destination without dragging.",
      equivalent: "Keyboard path covers the same constraints and warnings.",
      cancel: "Escape closes the menu without moving.",
      result: "Keyboard users can complete every non-essential move.",
      tone: "safe"
    },
    screenReader: {
      chip: "Screen reader move",
      title: "Destinations are named",
      card: "Screen reader announces Database backup, To do, position 2, move available.",
      source: "Source is included in the action description.",
      target: "Actions include Move to Review, Move to Blocked, Move after Security audit.",
      indicator: "Status announces moved or canceled.",
      equivalent: "Custom actions and visible Move menu match.",
      cancel: "Dismiss returns focus to the card.",
      result: "Assistive technology receives source, destination, and result.",
      tone: "safe"
    },
    multiSelect: {
      chip: "Multi-select drag",
      title: "Selected count is visible",
      card: "Moving 3 selected cards.",
      source: "Sources: To do and Backlog.",
      target: "Review accepts 2 cards; blocked card is listed separately.",
      indicator: "3 selected; 1 cannot move because dependency is open.",
      equivalent: "Bulk Move menu shows the same blocked item.",
      cancel: "Cancel preserves all selections.",
      result: "Bulk drag does not hide partial constraints."
    },
    mobile: {
      chip: "Mobile compact",
      title: "Small screens keep movement legible",
      card: "Drag handle, card title, Move button, and status wrap without overlap.",
      source: "Source and target names stack vertically.",
      target: "Drop targets are large and labelled.",
      indicator: "Insertion indicator remains text-backed.",
      equivalent: "Move menu remains reachable with one hand.",
      cancel: "Cancel and Undo controls fit below the board.",
      result: "Drag and drop remains optional on compact touch screens.",
      compact: true
    },
    risky: {
      chip: "Risky move",
      title: "High-impact drop requires review",
      card: "Moving contract to External vendor changes access.",
      source: "Source: Internal review.",
      target: "Destination: External vendor shared space.",
      indicator: "Confirmation required before access changes.",
      equivalent: "Move menu opens the same review step.",
      cancel: "Cancel keeps file internal.",
      result: "Drop does not silently change permissions."
    }
  };
  const item = config[mode];
  const titleId = `drag-and-drop-title-${idSuffix}`;
  const descId = `drag-and-drop-desc-${idSuffix}`;

  return (
    <section className={`drag-and-drop-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="drag-and-drop-header">
        <span>{item.chip}</span>
        <strong id={titleId}>{item.title}</strong>
      </header>
      <div className="drag-and-drop-board" id={descId}>
        <div className="drag-and-drop-column">
          <span>Source</span>
          <strong>To do</strong>
          <div className="drag-and-drop-card">
            <span className="drag-and-drop-handle" aria-hidden="true">::</span>
            <div>
              <strong>Database backup</strong>
              <span>{item.card}</span>
            </div>
            <button type="button" className="demo-button small">Move</button>
          </div>
        </div>
        <div className="drag-and-drop-column is-target">
          <span>Target</span>
          <strong>Review</strong>
          <div className="drag-and-drop-insertion">{item.indicator}</div>
        </div>
      </div>
      <div className="drag-and-drop-grid" aria-label="Drag and drop evidence">
        <div><span>Source object</span><strong>{item.source}</strong></div>
        <div><span>Drop target</span><strong>{item.target}</strong></div>
        <div><span>Insertion feedback</span><strong>{item.indicator}</strong></div>
        <div><span>Equivalent move</span><strong>{item.equivalent}</strong></div>
        <div><span>Cancel or recovery</span><strong>{item.cancel}</strong></div>
        <div><span>Status message</span><strong>{item.result}</strong></div>
      </div>
      <p className="demo-status">{item.result}</p>
    </section>
  );
}

function DragAndDropGoodUi() {
  return (
    <div className="quality-example drag-and-drop-demo">
      <DragAndDropPanel mode="validTarget" idSuffix="good-ui" />
    </div>
  );
}

function DragAndDropBadUi() {
  return (
    <div className="bad-ui-sample drag-and-drop-bad-ui">
      <section className="drag-and-drop-shell bad" aria-label="Broken drag and drop">
        <header className="drag-and-drop-header">
          <span>Pointer-only</span>
          <strong>No move alternative</strong>
        </header>
        <p>The card can only move by pointer drag. There is no drag handle, valid target feedback, invalid reason, insertion indicator, cancel path, undo, server failure recovery, keyboard move, or screen reader destination.</p>
        <div className="drag-and-drop-board bad">
          <div className="drag-and-drop-column">
            <span>To do</span>
            <strong>Database backup</strong>
          </div>
          <div className="drag-and-drop-column is-target">
            <span>Done?</span>
            <strong>Drop anywhere</strong>
          </div>
        </div>
      </section>
      <p className="demo-status">The broken UI turns movement into an invisible pointer-only command.</p>
    </div>
  );
}

function DragAndDropGoodUx() {
  const [mode, setMode] = useState<DragAndDropMode>("idle");
  return (
    <div className="quality-example drag-and-drop-demo">
      <div className="demo-row drag-and-drop-controls" aria-label="Drag and drop exercise controls">
        {dragAndDropGoodLabels.map(([key, label]) => (
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
      <DragAndDropPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Drag and drop state: {dragAndDropGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function DragAndDropBadUx() {
  const [mode, setMode] = useState<DragAndDropBadMode>("pointerOnly");
  const copy: Record<DragAndDropBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    pointerOnly: {
      title: "Pointer-only",
      body: "Cards can move only by mouse drag; there is no Move menu, keyboard path, or screen reader destination.",
      consequence: "Users who cannot drag cannot move work.",
      metric: "No equivalent"
    },
    noTargetFeedback: {
      title: "No target feedback",
      body: "Columns do not show valid targets, invalid targets, or insertion position before release.",
      consequence: "Users guess where the card will land.",
      metric: "No preview"
    },
    invalidSilent: {
      title: "Invalid silent",
      body: "Done looks valid but silently rejects the card after drop.",
      consequence: "The visual state lies about the model.",
      metric: "Silent reject"
    },
    scrollHijack: {
      title: "Scroll hijack",
      body: "A vertical scroll starts dragging the card and changes workflow status.",
      consequence: "Reading movement causes data changes.",
      metric: "Conflict"
    },
    noCancel: {
      title: "No cancel",
      body: "Release outside a target still moves the card to the nearest column.",
      consequence: "Users cannot safely abort the drag.",
      metric: "No cancellation"
    },
    serverMismatch: {
      title: "Server mismatch",
      body: "The card stays in Review visually even though the server rejected the move.",
      consequence: "The board and underlying status diverge.",
      metric: "Model drift"
    },
    noEquivalent: {
      title: "No equivalent",
      body: "The card has no keyboard, switch, screen reader, touch menu, or visible destination control.",
      consequence: "Drag becomes the only movement path.",
      metric: "Drag only"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example drag-and-drop-bad-ux is-${mode}`}>
      <div className="demo-row drag-and-drop-controls" aria-label="Drag and drop misuse controls">
        {dragAndDropBadLabels.map(([key, label]) => (
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
      <section className="drag-and-drop-shell bad" aria-label={`Drag and drop failure: ${item.title}`}>
        <header className="drag-and-drop-header">
          <span>{item.title}</span>
          <strong>{item.metric}</strong>
        </header>
        <p>{item.body}</p>
        <div className="drag-and-drop-grid">
          <div><span>Source object</span><strong>{mode === "pointerOnly" ? "Mouse only" : "Unclear"}</strong></div>
          <div><span>Drop target</span><strong>{mode === "noTargetFeedback" || mode === "invalidSilent" ? "Misleading" : "Unsafe"}</strong></div>
          <div><span>Insertion feedback</span><strong>{mode === "noTargetFeedback" ? "Missing" : "Unknown"}</strong></div>
          <div><span>Equivalent move</span><strong>{mode === "noEquivalent" || mode === "pointerOnly" ? "Missing" : "Mismatch"}</strong></div>
          <div><span>Cancel or recovery</span><strong>{mode === "noCancel" || mode === "serverMismatch" ? "Broken" : "Weak"}</strong></div>
          <div><span>Status message</span><strong>{item.consequence}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DragAndDropGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DragAndDropBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DragAndDropGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DragAndDropBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
